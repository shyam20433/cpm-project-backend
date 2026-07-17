import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'

export default class RolesController {
  public async getRoles({ response }: HttpContextContract) {
    const roles = await Role.query().preload('permissions')

    return response.ok(roles)
  }

  public async getRole({ params, response }: HttpContextContract) {
    const role = await Role.query().where('key', params.key).preload('permissions').first()

    if (!role) {
      return response.notFound({
        message: 'Role not found',
      })
    }

    return response.ok(role)
  }

  public async postRole({ request, response }: HttpContextContract) {
    const data = request.only(['key', 'name', 'description', 'status'])

    try {
      const role = await Role.create(data)

      return response.created(role)
    } catch (error) {
      return response.notAcceptable({
        message: 'Role already exists',
      })
    }
  }

  public async updateRole({ params, request, response }: HttpContextContract) {
    const role = await Role.find(params.key)

    if (!role) {
      return response.notFound({
        message: 'Role not found',
      })
    }

    role.merge(request.only(['name', 'description', 'status']))

    await role.save()

    return response.ok(role)
  }

  public async deleteRole({ params, response }: HttpContextContract) {
    const role = await Role.find(params.key)

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
