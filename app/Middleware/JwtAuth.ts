import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";
import { AuthUser } from "Contracts/Auth";

import Endpoint from "App/Models/Endpoint";
import AssignedEndpoint from "App/Models/AssignedEndpoint";

export default class JwtAuth {
  public async handle(
    ctx: HttpContextContract,
    next: () => Promise<void>
  ) {
    const { request, response, route } = ctx
    const authHeader = request.header("authorization");

    if (!authHeader) {
      return response.unauthorized({
        message: "Token Missing",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    let payload: any;

    try {
      payload = jwt.verify(token, Env.get("APP_KEY"));
      const authUser: AuthUser = {
        email: payload.email,
        roleKey: payload.roleKey,
      }

      request.authUser = authUser
    } catch {
      return response.unauthorized({
        message: "Invalid Token",
      });
    }

    const roleKey = payload.roleKey;
    ; (request as any).user = payload
    const method = request.method();
    const pattern = route!.pattern;
    const endpoint = await Endpoint.query()
      .where("method", method)
      .where("route", pattern)
      .first();

    if (!endpoint) {
      return response.notFound({
        message: "Endpoint not found",
      });
    }

    const access = await AssignedEndpoint.query()
      .join(
        "assigned_permissions", "assigned_permissions.permissionKey", "assigned_endpoints.permissionKey"
      )
      .where("assigned_permissions.roleKey", roleKey)
      .where("assigned_endpoints.endpointId", endpoint.id)
      .select("assigned_endpoints.*")
      .first();

    if (!access) {
      return response.forbidden({
        message: "Permission Denied",
      });
    }

    await next();
  }
}
