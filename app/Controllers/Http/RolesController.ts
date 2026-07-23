import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import RoleRepository from 'App/Repositories/RoleRepository'

import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
import CreateRoleValidator from 'App/Validators/Role/CreateRoleValidator'
import DeleteRoleValidator from 'App/Validators/Role/DeleteRoleValidator'
import GetRoleValidator from 'App/Validators/Role/GetRoleValidator'
import UpdateRoleValidator from 'App/Validators/Role/UpdateRoleValidator'

export default class RolesController {
  private roleRepository = new RoleRepository()

  public async getRoles({ request, response }: HttpContextContract) {
    try {
      const filters = await request.validate(IsIncludeValidator)

      const roles = await this.roleRepository.getAll(filters)

      return response.send({
        success: true,
        message: 'Roles fetched successfully',
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

  public async getRole({ request, response }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)

    try {
      const role = await this.roleRepository.findByKey(key)

      return response.send({
        success: true,
        message: 'Role fetched successfully',
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
      const role = await this.roleRepository.createRole(data)

      return response.created({
        success: true,
        message: 'Role created successfully',
        data: role,
      })
    } catch (error: any) {
      return response.notAcceptable({
        success: false,
        message: 'Role already exists',
        error: error.messages || error.message,
      })
    }
  }

  public async updateRole({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(UpdateRoleValidator)
      const { key, ...newData } = data
      const role = await this.roleRepository.updateRole(key, newData)

      return response.send({
        success: true,
        message: 'Role updated successfully',
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
    try {
      let roles
      const { key, updatestatus } = await request.validate(DeleteRoleValidator)

      if (!updatestatus) {
        roles = await this.roleRepository.disableRole(key)
      } else {
        roles = await this.roleRepository.enableRole(key)
      }

      return response.send({
        success: true,
        message: updatestatus ? 'Role enabled successfully' : 'Role disabled successfully',
        data: roles,
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
