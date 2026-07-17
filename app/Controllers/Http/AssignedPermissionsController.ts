import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AssignedPermission from 'App/Models/AssignedPermission'

import GetAssignedPermissionValidator from 'App/Validators/AssignedPermission/GetAssignedPermissionValidator'
import CreateAssignedPermissionValidator from 'App/Validators/AssignedPermission/CreateAssignedPermissionValidator'
import DeleteAssignedPermissionValidator from 'App/Validators/AssignedPermission/DeleteAssignedPermissionValidator'
import UpdateAssignedPermissionValidator from 'App/Validators/AssignedPermission/UpdateAssignedPermissionValidator'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ response }: HttpContextContract) {
    const assignedPermissions = await AssignedPermission.query()
      .preload('role')
      .preload('permission')

    return response.ok(assignedPermissions)
  }

  public async getAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)
    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
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
    const data = await request.validate(CreateAssignedPermissionValidator)

    try {
      const assignedPermission = await AssignedPermission.create(data)

      return response.created(assignedPermission)
    } catch (error) {
      console.log(error)
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async updateAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)

    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
      .first()

    if (!assignedPermission) {
      return response.notFound({
        message: 'Assigned permission not found',
      })
    }
    try {
      assignedPermission.merge(await request.validate(UpdateAssignedPermissionValidator))

      await assignedPermission.save()

      return response.ok(assignedPermission)
    } catch (error) {
      return response.badRequest({
        message: error.message,
      })
    }
  }

  public async deleteAssignedPermission({ request, response }: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(DeleteAssignedPermissionValidator)

    const assignedPermission = await AssignedPermission.query()
      .where('roleKey', roleKey)
      .where('permissionKey', permissionKey)
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
