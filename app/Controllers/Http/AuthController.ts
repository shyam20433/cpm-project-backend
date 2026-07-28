import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import LoginValidator from 'App/Validators/LoginValidator'
import AuthRepository from 'App/Repositories/AuthRepository'
const authRepository = new AuthRepository()
export default class AuthController {

  public async login({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(LoginValidator)

      const result = await authRepository.login(data.email)

      return response.ok({
        success: true,
        message: 'Login successful',
        token: result.token,
        role: result.role,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned roles',
        error: error.messages || error.message,
      })
    }
  }
}
