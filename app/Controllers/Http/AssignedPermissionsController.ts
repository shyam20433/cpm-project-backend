import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedPermission from 'App/Models/AssignedPermission'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ response }: HttpContextContract) {
    const assignedPermissions = await AssignedPermission.query()
      .preload('role')
      .preload('permission')

    return response.ok(assignedPermissions)
  }

  public async getAssignedPermission({ params, response }: HttpContextContract) {
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', params.roleKey)
      .where('permissionKey', params.permissionKey)
      .preload('role')
      .preload('permission')
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }

    return response.ok(assignedPermission)
  }

  public async postAssignedPermission({ request, response }: HttpContextContract) {
    const data = request.only([
      'roleKey',
      'permissionKey',
    ])

    try {
      const assignedPermission = await AssignedPermission.create(data)

      return response.created(assignedPermission)
    } catch (error) {
      return response.notAcceptable({
        message: 'Permission already assigned to role',
      })
    }
  }

  public async updateAssignedPermission({ params, request, response }: HttpContextContract) {
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', params.roleKey)
      .where('permissionKey', params.permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }

    assignedPermission.merge(
      request.only([
        'roleKey',
        'permissionKey',
      ])
    )

    await assignedPermission.save()

    return response.ok(assignedPermission)
  }

  public async deleteAssignedPermission({ params, response }: HttpContextContract) {
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', params.roleKey)
      .where('permissionKey', params.permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }

    await assignedPermission.delete()

    return response.ok({
      message: 'Assigned permission deleted successfully',
    })
  }
}
