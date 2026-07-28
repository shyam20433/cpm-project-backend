import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import SetupAllRepository from 'App/Repositories/SetupAllRepository'
import SetupAllValidator from 'App/Validators/SetupAllValidator'

const roleRepository = new SetupAllRepository()

export default class SetupAllController {
  public async setupAll({ request, response }: HttpContextContract) {
    const data = await request.validate(SetupAllValidator)

    const trx = await Database.transaction()

    try {

      const result = await roleRepository.setupAll(data, trx)

      await trx.commit()

      return response.created({
        success: true,
        message: 'Setup completed successfully',
        data: result,
      })
    } catch (error: any) {
      await trx.rollback()

      return response.badRequest({
        success: false,
        message: error.message,
      })
    }
  }
}
