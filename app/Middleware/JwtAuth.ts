import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import jwt from "jsonwebtoken";

import Endpoint from "App/Models/Endpoint";
import AssignedPermission from "App/Models/AssignedPermission";
import AssignedEndpoint from "App/Models/AssignedEndpoint";

export default class JwtAuth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
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
    } catch {
      return response.unauthorized({
        message: "Invalid Token",
      });
    }

    const roleKey = payload.roleKey;

    const method = request.method();
    const pattern = request.url();
    console.log(request.url());
    console.log(request.method());
    const endpoints = await Endpoint.query().where("method", method);
    console.log(endpoints)

    const endpoint = endpoints.find((e) => {
      const regex = new RegExp("^" + e.route.replace(/:[^/]+/g, "[^/]+") + "$");

      return regex.test(pattern);
    });

    if (!endpoint) {
      return response.notFound({
        message: "Endpoint not found",
      });
    }
    const permissions = await AssignedPermission.query().where(
      "roleKey",
      roleKey
    );


    const permissionKeys = permissions.map(
      (permission) => permission.permissionKey
    );
    console.log(permissionKeys)

    const access = await AssignedEndpoint.query()
      .where("endpointId", endpoint.id)
      .whereIn("permissionKey", permissionKeys)
      .first();
    console.log(access)

    if (!access) {
      return response.forbidden({
        message: "Permission Denied",
      });
    }

    await next();
  }
}
