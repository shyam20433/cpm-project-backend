import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AssignedRoleRepository from 'App/Repositories/AssignedRoleRepository'

import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import AssignedRolesValidator from 'App/Validators/FetchAll/AssignedRolesValidator'
const assignedRoleRepository = new AssignedRoleRepository()
export default class AssignedRolesController {


  public async getAssignedRoles({ request }: HttpContextContract) {
      const qs = request.qs()

        AssignedRolesValidator.validateQueryParams(qs)

      const { sort } = await request.validate(AssignedRolesValidator)

      const assignedRoles = await assignedRoleRepository.getAll(sort)

      return {
        success: true,
        message: 'assigned roles fetched successfully',
        data: assignedRoles,
      }
  }

  public async getAssignedRole({ request }: HttpContextContract) {
      const { id } = await request.validate(GetAssignedRoleValidator)
      const assignedRole = await assignedRoleRepository.findById(id)
      await CheckRoleExists.validate(assignedRole.roleKey)

      await assignedRoleRepository.loadRole(assignedRole)

      return {
        success: true,
        message: 'assigned role fetched successfully',
        data: assignedRole,
      }
  }

  public async postAssignedRole({ request}: HttpContextContract) {

      const data = await request.validate(CreateAssignedRoleValidator)
      await CheckRoleExists.validate(data.roleKey)

      const assignedRole = await assignedRoleRepository.createAssignedRole(data)

      return {
        success: true,
        message: 'assigned role created successfully',
        data: assignedRole,
      }

  }

  public async updateAssignedRole({ request }: HttpContextContract) {
      const { id } = await request.validate(GetAssignedRoleValidator)
      const assignedRole = await assignedRoleRepository.findById(id)
      const data = await request.validate(UpdateAssignedRoleValidator)
      const roleKey = data.roleKey ?? assignedRole.roleKey
      const email = data.email ?? assignedRole.email
      await CheckRoleExists.validate(roleKey)
      const updatedAssignedRole = await assignedRoleRepository.updateAssignedRole(id, data)
      return {
        success: true,
        message: 'assigned role updated successfully',
        data: updatedAssignedRole,
      }

  }

  public async deleteAssignedRole({ request }: HttpContextContract) {
      const { id } = await request.validate(DeleteAssignedRoleValidator)
      const assignedRole = await assignedRoleRepository.findById(id)

      await CheckRoleExists.validate(assignedRole.roleKey)
      await assignedRoleRepository.deleteAssignedRole(assignedRole)

      return {
        success: true,
        message: 'assigned role deleted successfully',
      }
  }
}
