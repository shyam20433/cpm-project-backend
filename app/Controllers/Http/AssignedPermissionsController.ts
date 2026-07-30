import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckPermissionExists from 'App/Validators/Exists/CheckPermissionExists'

import GetAssignedPermissionValidator from 'App/Validators/AssignedPermission/GetAssignedPermissionValidator'
import CreateAssignedPermissionValidator from 'App/Validators/AssignedPermission/CreateAssignedPermissionValidator'
import DeleteAssignedPermissionValidator from 'App/Validators/AssignedPermission/DeleteAssignedPermissionValidator'
import UpdateAssignedPermissionValidator from 'App/Validators/AssignedPermission/UpdateAssignedPermissionValidator'
import AssignedPermissionsValidator from 'App/Validators/FetchAll/AssignedPermissionsValidator'

import AssignedPermissionRepository from 'App/Repositories/AssignedPermissionRepository'

export default class AssignedPermissionsController {
  public async getAssignedPermissions({ request }: HttpContextContract) {

    const qs = request.qs()
    AssignedPermissionsValidator.validateQueryParams(qs)
    const { sort } = await request.validate(AssignedPermissionsValidator)

    const assignedPermissions = await AssignedPermissionRepository.getAssignedPermissions(sort)

    return {
      success: true,
      message: 'assigned permissions fetched successfully',
      data: assignedPermissions,
    }

  }

  public async getAssignedPermission({ request }: HttpContextContract) {

    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)

    await Promise.all([
      CheckRoleExists.validate(roleKey),
      CheckPermissionExists.validate(permissionKey),
    ])

    const assignedPermission = await AssignedPermissionRepository.getAssignedPermission(
      roleKey,
      permissionKey
    )



    return {
      success: true,
      message: 'assigned permission fetched successfully',
      data: assignedPermission,
    }
  }

  public async postAssignedPermission({ request, response }: HttpContextContract) {

    const data = await request.validate(CreateAssignedPermissionValidator)

    await Promise.all([
      CheckRoleExists.validate(data.roleKey),
      CheckPermissionExists.validate(data.permissionKey),
    ])

    
    const assignedPermission = await AssignedPermissionRepository.create(data)

    return response.created({
      success: true,
      message: 'assigned permission created successfully',
      data: assignedPermission,
    })

  }

  public async updateAssignedPermission({ request }: HttpContextContract) {

    const { roleKey, permissionKey } = await request.validate(GetAssignedPermissionValidator)

    await Promise.all([
      CheckRoleExists.validate(roleKey),
      CheckPermissionExists.validate(permissionKey),
    ])

    const assignedPermission = await AssignedPermissionRepository.find(roleKey, permissionKey)

    const data = await request.validate(UpdateAssignedPermissionValidator)

    const updatedRoleKey = data.roleKey ?? assignedPermission.roleKey
    const updatedPermissionKey = data.permissionKey ?? assignedPermission.permissionKey

    await Promise.all([
      CheckRoleExists.validate(updatedRoleKey),
      CheckPermissionExists.validate(updatedPermissionKey),
    ])





    const updatedAssignedPermission = await AssignedPermissionRepository.update(
      assignedPermission,
      data
    )

    return {
      success: true,
      message: 'assigned permission updated successfully',
      data: updatedAssignedPermission,
    }

  }

  public async deleteAssignedPermission({ request}: HttpContextContract) {
    const { roleKey, permissionKey } = await request.validate(DeleteAssignedPermissionValidator)

    await Promise.all([
      CheckRoleExists.validate(roleKey),
      CheckPermissionExists.validate(permissionKey),
    ])

    const assignedPermission = await AssignedPermissionRepository.find(roleKey, permissionKey)


    await AssignedPermissionRepository.delete(assignedPermission)

    return {
      success: true,
      message: 'assigned permission deleted successfully',
    }
  }
}
