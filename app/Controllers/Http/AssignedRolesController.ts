import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AssignedRoleRepository from 'App/Repositories/AssignedRoleRepository'

import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import AssignedRolesValidator from 'App/Validators/FetchAll/AssignedRolesValidator'

export default class AssignedRolesController {
  private assignedRoleRepository = new AssignedRoleRepository()

  public async getAssignedRoles({ request, response }: HttpContextContract) {
    try {
      const qs = request.qs()

      try {
        AssignedRolesValidator.validateQueryParams(qs)
      } catch (error: any) {
        return response.badRequest({
          success: false,
          message: 'Invalid query parameters',
          error: error.message,
        })
      }
      const { sort } = await request.validate(AssignedRolesValidator)

      const assignedRoles = await this.assignedRoleRepository.getAll(sort)

      return response.send({
        success: true,
        message: 'assigned roles fetched successfully',
        data: assignedRoles,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned roles',
        error: error.messages || error.message,
      })
    }
  }

  public async getAssignedRole({ request, response }: HttpContextContract) {
    try {
      const { id } = await request.validate(GetAssignedRoleValidator)
      const assignedRole = await this.assignedRoleRepository.findById(id)
      await CheckRoleExists.validate(assignedRole.roleKey)

      await this.assignedRoleRepository.loadRole(assignedRole)

      return response.send({
        success: true,
        message: 'assigned role fetched successfully',
        data: assignedRole,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to fetch assigned role',
        error: error.messages || error.message,
      })
    }
  }

  public async postAssignedRole({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAssignedRoleValidator)
      await CheckRoleExists.validate(data.roleKey)

      const exists = await this.assignedRoleRepository.exists(data.roleKey, data.email)
      if (exists) {
        return response.badRequest({
          success: false,
          message: 'Role is already assigned to this user',
        })
      }

      const assignedRole = await this.assignedRoleRepository.createAssignedRole(data)

      return response.created({
        success: true,
        message: 'assigned role created successfully',
        data: assignedRole,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to assign role',
        error: error.messages || error.message,
      })
    }
  }

  public async updateAssignedRole({ request, response }: HttpContextContract) {
    try {
      const { id } = await request.validate(GetAssignedRoleValidator)
      const assignedRole = await this.assignedRoleRepository.findById(id)

      const data = await request.validate(UpdateAssignedRoleValidator)

      const roleKey = data.roleKey ?? assignedRole.roleKey
      const email = data.email ?? assignedRole.email

      await CheckRoleExists.validate(roleKey)

      const duplicate = await this.assignedRoleRepository.exists(roleKey, email)
      if (duplicate && duplicate.id !== assignedRole.id) {
        return response.badRequest({
          success: false,
          message: 'Role is already assigned to this user',
        })
      }

      const updatedAssignedRole = await this.assignedRoleRepository.updateAssignedRole(id, data)

      return response.send({
        success: true,
        message: 'assigned role updated successfully',
        data: updatedAssignedRole,
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to update assigned role',
        error: error.messages || error.message,
      })
    }
  }

  public async deleteAssignedRole({ request, response }: HttpContextContract) {
    try {
      const { id } = await request.validate(DeleteAssignedRoleValidator)
      const assignedRole = await this.assignedRoleRepository.findById(id)

      await CheckRoleExists.validate(assignedRole.roleKey)
      await this.assignedRoleRepository.deleteAssignedRole(id)

      return response.send({
        success: true,
        message: 'assigned role deleted successfully',
      })
    } catch (error: any) {
      return response.badRequest({
        success: false,
        message: 'Failed to delete assigned role',
        error: error.messages || error.message,
      })
    }
  }
}
