import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import jwt from "jsonwebtoken";
import Env from "@ioc:Adonis/Core/Env";
export default class JwtAuth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const authHeader = request.header("authorization");
    if (!authHeader) {
      return response.unauthorized({
        success: false,
        message: "Authorization heading is missing",
      });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return response.unauthorized({
        success: false,
        message: "Invalid Authorization header ",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, Env.get("APP_KEY"))

      await next();
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: "Invalid or Expired Token",
      });
    }
  }
}
