import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import CreatePermissionValidator from 'App/Validators/Permission/CreatePermissionValidator'
import DeletePermissionValidator from 'App/Validators/Permission/DeletePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/Permission/UpdatePermissionValidator'
import GetPermissionValidator from 'App/Validators/Permission/GetPermissionValidator'
export default class PermissionsController {
  public async getPermissions({ response }: HttpContextContract) {
    const permissions = await Permission.query().preload('roles').preload('endpoints')

    return response.ok(permissions)
  }

  public async getPermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)
    const permission = await Permission.query()
      .where('key', key)
      .preload('roles')
      .preload('endpoints')
      .first()

    if (!permission) {
      return response.notFound({
        message: 'Permission not found',
      })
    }

    return response.ok(permission)
  }

  public async postPermission({ request, response }: HttpContextContract) {
    const data = await request.validate(CreatePermissionValidator)

    try {
      const permission = await Permission.create(data)

      return response.created(permission)
    } catch (error) {
      return response.notAcceptable({
        message: 'Permission already exists',
      })
    }
  }

  public async updatePermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)
    const permission = await Permission.find(key)

    if (!permission) {
      return response.notFound({
        message: 'Permission not found',
      })
    }
    try {
      permission.merge(await request.validate(UpdatePermissionValidator))

      await permission.save()

      return response.ok(permission)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deletePermission({ request, response }: HttpContextContract) {
    const { key } = await request.validate(DeletePermissionValidator)
    const permission = await Permission.find(key)

    if (!permission) {
      return response.notFound({
        message: 'Permission not found',
      })
    }

    permission.status = false

    await permission.save()

    return response.ok({
      message: 'Permission disabled successfully',
    })
  }
}
