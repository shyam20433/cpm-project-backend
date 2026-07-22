import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AssignedRoleRepository from 'App/Repositories/AssignedRoleRepository'

import GetAssignedRoleValidator from 'App/Validators/AssignedRole/GetAssignedRoleValidator'
import CreateAssignedRoleValidator from 'App/Validators/AssignedRole/CreateAssignedRoleValidator'
import UpdateAssignedRoleValidator from 'App/Validators/AssignedRole/UpdateAssignedRoleValidator'
import DeleteAssignedRoleValidator from 'App/Validators/AssignedRole/DeleteAssignedRoleValidator'

import CheckRoleExists from 'App/Validators/Exists/CheckRoleExists'
import CheckRoleActive from 'App/Validators/Active/CheckRoleActive'
import AssignedRolesValidator from 'App/Validators/FetchAll/AssignedRolesValidator'

export default class AssignedRolesController {
  private assignedRoleRepository = new AssignedRoleRepository()

  public async getAssignedRoles({ request, response }: HttpContextContract) {
    try {
      const { sort } = await request.validate(AssignedRolesValidator)

      const assignedRoles = await this.assignedRoleRepository.getAll(sort)

      return response.status(200).send({
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
    const { id } = await request.validate(GetAssignedRoleValidator)

    try {
      const assignedRole = await this.assignedRoleRepository.findById(id)

      if (!assignedRole) {
        return response.notFound({
          success: false,
          message: 'Assigned role not found',
        })
      }

      await CheckRoleExists.validate(assignedRole.roleKey)
      await CheckRoleActive.validate(assignedRole.roleKey)

      await this.assignedRoleRepository.loadRole(assignedRole)

      return response.status(200).send({
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
    const data = await request.validate(CreateAssignedRoleValidator)

    try {
      await CheckRoleExists.validate(data.roleKey)
      await CheckRoleActive.validate(data.roleKey)

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
    const { id } = await request.validate(GetAssignedRoleValidator)

    try {
      const assignedRole = await this.assignedRoleRepository.findById(id)

      if (!assignedRole) {
        return response.notFound({
          success: false,
          message: 'Assigned role not found',
        })
      }

      const data = await request.validate(UpdateAssignedRoleValidator)

      const roleKey = data.roleKey ?? assignedRole.roleKey

      await CheckRoleExists.validate(roleKey)
      await CheckRoleActive.validate(roleKey)

      const updatedAssignedRole = await this.assignedRoleRepository.updateAssignedRole(id, data)

      return response.status(200).send({
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
    const { id } = await request.validate(DeleteAssignedRoleValidator)

    try {
      const assignedRole = await this.assignedRoleRepository.findById(id)

      if (!assignedRole) {
        return response.notFound({
          success: false,
          message: 'Assigned role not found',
        })
      }

      await CheckRoleExists.validate(assignedRole.roleKey)
      await CheckRoleActive.validate(assignedRole.roleKey)

      await this.assignedRoleRepository.deleteAssignedRole(id)

      return response.status(200).send({
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
