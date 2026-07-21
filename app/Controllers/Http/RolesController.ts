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

      return response.status(200).send({
        success: true,
        message: 'roles fetched successfully',
        data: roles,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch roles',
        error: error.messages || error.message,
      })
    }
  }

  public async getRolesDisable({ response }: HttpContextContract) {
    try {
      const roles = await Role.query().where('status', false)
      //.preload('permissions')

      return response.status(200).send({
        success: true,
        message: 'roles fetched successfully',
        data: roles,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch disabled roles',
        error: error.messages || error.message,
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
          success: false,
          message: 'Role not found',
        })
      }

      return response.status(200).send({
        success: true,
        message: 'role fetched successfully',
        data: role,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch role',
        error: error.messages || error.message,
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
        success: false,
        message: 'Role already exists',
        error: error.messages || error.message,
      })
    }
  }

  public async updateRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)
    const role = await Role.find(key)

    if (!role) {
      return response.notFound({
        success: false,
        message: 'Role not found',
      })
    }
    try {
      role.merge(await request.validate(UpdateRoleValidator))

      await role.save()

      return response.status(200).send({
        success: true,
        message: 'role updated successfully',
        data: role,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update role',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(DeleteRoleValidator)
    const role = await Role.find(key)

    if (!role) {
      return response.notFound({
        success: false,
        message: 'Role not found',
      })
    }

    try {
      role.status = false

      await role.save()

      return response.status(200).send({
        success: true,
        message: 'role disabled successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to disable role',
        error: error.messages || error.message,
      })
    }
  }
}
