import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import CreateRoleValidator from 'App/Validators/Role/CreateRoleValidator'
import DeleteRoleValidator from 'App/Validators/Role/DeleteRoleValidator'
import GetRoleValidator from 'App/Validators/Role/GetRoleValidator'
import UpdateRoleValidator from 'App/Validators/Role/UpdateRoleValidator'

export default class RolesController {
  public async getRoles({ request, response }: HttpContextContract) {
    try {
      const { status, sort } = request.qs()
      const query = Role.query()
      //.preload('permissions')
      if (status !== undefined) {
        query.where('status', status === 'true')
      }
      if (sort) {
        if (sort.startsWith('-')) {
          query.orderBy(sort.substring(1), 'desc')
        } else {
          query.orderBy(sort, 'asc')
        }
      }
      const roles = await query

      return response.ok(roles)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async getRolesDisable({ response }: HttpContextContract) {
    try {
      const roles = await Role.query().where('status', false)
      //.preload('permissions')

      return response.ok(roles)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async getRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)

    try {
      const role = await Role.query().where('key', key).first()
      //.preload('permissions')

      if (!role) {
        return response.notFound({
          message: 'Role not found',
        })
      }

      return response.ok(role)
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }

  public async postRole({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateRoleValidator)

    try {
      const role = await Role.create(data)

      return response.created(role)
    } catch (error: any) {
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
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
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

    try {
      role.status = false

      await role.save()

      return response.ok({
        message: 'Role disabled successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        message: error.messages,
      })
    }
  }
}
