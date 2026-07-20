import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import CreateRoleValidator from 'App/Validators/Role/CreateRoleValidator'
import DeleteRoleValidator from 'App/Validators/Role/DeleteRoleValidator'
import GetRoleValidator from 'App/Validators/Role/GetRoleValidator'
import UpdateRoleValidator from 'App/Validators/Role/UpdateRoleValidator'

export default class RolesController {
  public async getRoles({ response }: HttpContextContract) {
    const roles = await Role.query().where('status', true)
    //.preload('permissions')

    return response.ok(roles)
  }

  public async getRolesDisable({ response }: HttpContextContract) {
    const roles = await Role.query().where('status', false)
    //.preload('permissions')

    return response.ok(roles)
  }

  public async getRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)

    const role = await Role.query().where('key', key).first()
    //.preload('permissions')

    if (!role) {
      return response.notFound({
        message: 'Role not found',
      })
    }

    return response.ok(role)
  }

  public async postRole({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateRoleValidator)

    try {
      const role = await Role.create(data)

      return response.created(role)
    } catch (error) {
      return response.notAcceptable({
        message: 'Role already exists',
      })
    }
  }

  public async updateRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)
    const role = await Role.find(key)

    if (!role) {
      return response.notFound({
        message: 'Role not found',
      })
    }
    try {
      role.merge(await request.validate(UpdateRoleValidator))

      await role.save()

      return response.ok(role)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deleteRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(DeleteRoleValidator)
    const role = await Role.find(key)

    if (!role) {
      return response.notFound({
        message: 'Role not found',
      })
    }

    role.status = false

    await role.save()

    return response.ok({
      message: 'Role disabled successfully',
    })
  }
}
