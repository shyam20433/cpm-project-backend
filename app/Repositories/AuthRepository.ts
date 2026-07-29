import AssignedRole from 'App/Models/AssignedRole'
import Env from '@ioc:Adonis/Core/Env'
import jwt from 'jsonwebtoken'

export default class AuthRepository {
  public async login(email: string) {
    const assignedRole = await AssignedRole.query().where('email', email).first()

    if (!assignedRole) {
      throw new Error('ROLE NOT ASSIGNED ')
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
