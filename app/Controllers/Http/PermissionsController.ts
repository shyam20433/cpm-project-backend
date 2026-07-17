import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'

export default class PermissionsController {
  public async getPermissions({ response }: HttpContextContract) {
    const permissions = await Permission.query().preload('roles').preload('endpoints')

    return response.ok(permissions)
  }

  public async getPermission({ params, response }: HttpContextContract) {
    const permission = await Permission.query()
      .where('key', params.key)
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
    const data = request.only(['key', 'name', 'description', 'status'])

    try {
      const permission = await Permission.create(data)

      return response.created(permission)
    } catch (error) {
      return response.notAcceptable({
        message: 'Permission already exists',
      })
    }
  }

  public async updatePermission({ params, request, response }: HttpContextContract) {
    const permission = await Permission.find(params.key)

    if (!permission) {
      return response.notFound({
        message: 'Permission not found',
      })
    }

    permission.merge(request.only(['name', 'description', 'status']))

    await permission.save()

    return response.ok(permission)
  }

  public async deletePermission({ params, response }: HttpContextContract) {
    const permission = await Permission.find(params.key)

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
