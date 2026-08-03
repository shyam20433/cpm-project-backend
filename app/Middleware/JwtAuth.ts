import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";
import { AuthUser } from "Contracts/auth";

import Endpoint from "App/Models/Endpoint";
import AssignedEndpoint from "App/Models/AssignedEndpoint";
import RedisRepository from "App/Repositories/RedisRepository";

const redisRepository = new RedisRepository();

interface JwtPayload {
  email: string;
  roleKey: string;
}

export default class JwtAuth {
  public async handle(
    ctx: HttpContextContract,
    next: () => Promise<void>
  ) {
    const { request, response, route } = ctx;

    const authHeader = request.header("authorization");

    if (!authHeader) {
      return response.unauthorized({
        message: "Token Missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    let payload: JwtPayload;

    try {
      payload = jwt.verify(token, Env.get("APP_KEY")) as JwtPayload;

      const authUser: AuthUser = {
        email: payload.email,
        roleKey: payload.roleKey,
      };

      request.authUser = authUser;
    } catch {
      return response.unauthorized({
        message: "Invalid Token",
      });
    }

    const roleKey = payload.roleKey;
    const method = request.method();
    const pattern = route!.pattern;

    const endpointCacheKey = `endpoint:${method}:${pattern}`;

    let endpoint = await redisRepository.get<any>(endpointCacheKey);

    if (!endpoint) {
      console.log("Endpoint cache MISS");

      const endpointModel = await Endpoint.query()
        .where("method", method)
        .where("route", pattern)
        .first();

      if (!endpointModel) {
        return response.notFound({
          message: "Endpoint not found",
        });
      }

      endpoint = endpointModel.toJSON();
      await redisRepository.set(endpointCacheKey, endpoint, 3600);
      console.log("Endpoint cache SAVED");
    }

    const roleCacheKey = `role-endpoints:${roleKey}`;
    let endpointIds = await redisRepository.get<number[]>(roleCacheKey);
    if (!endpointIds) {
      console.log("Role endpoint cache MISS");
      const assignedEndpoints = await AssignedEndpoint.query()
        .join(
          "assigned_permissions",
          "assigned_permissions.permissionKey",
          "assigned_endpoints.permissionKey"
        )
        .where("assigned_permissions.roleKey", roleKey)
        .select("assigned_endpoints.endpointId");

      endpointIds = assignedEndpoints.map((item) => item.endpointId);

      await redisRepository.set(roleCacheKey, endpointIds, 3600);
      const cached = await redisRepository.get(roleCacheKey)

      console.log("Read after SET:", cached)

      console.log("Role endpoint cache SAVED");
    }

    if (!endpointIds.includes(endpoint.id)) {
      return response.forbidden({
        message: "Permission Denied",
      });
    }

    await next();
  }
}
