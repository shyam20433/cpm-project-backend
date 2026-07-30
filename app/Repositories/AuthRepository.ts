import AssignedRole from 'App/Models/AssignedRole'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'
import { Exception } from '@adonisjs/core/build/standalone'

export default class AuthRepository {
  public async login(email: string) {
    const assignedRole = await AssignedRole.query().where('email', email).first()

    if (!assignedRole) {
      throw new Exception(
        'Role not assigned',
        404,
        'E_ROLE_NOT_ASSIGNED'
      )
    }
    const token = jwt.sign(
      {
        email,
        roleKey: assignedRole.roleKey,
      },
      Env.get('APP_KEY'),
      /*       {
              expiresIn: '1d',
            } */
    )

    return {
      token: token,
      role: assignedRole.roleKey,
    }
  }
}
