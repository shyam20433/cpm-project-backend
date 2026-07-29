import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import RoleRepository from 'App/Repositories/RoleRepository'

import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
import CreateRoleValidator from 'App/Validators/Role/CreateRoleValidator'
import DeleteRoleValidator from 'App/Validators/Role/DeleteRoleValidator'
import GetRoleValidator from 'App/Validators/Role/GetRoleValidator'
import SetupRoleValidator from 'App/Validators/Role/SetupRoleValidator'
import UpdateRoleValidator from 'App/Validators/Role/UpdateRoleValidator'
const roleRepository = new RoleRepository()
export default class RolesController {


  public async getRoles({ request }: HttpContextContract) {

      const filters = await request.validate(IsIncludeValidator)

      const roles = await roleRepository.getAll(filters)

      return {
        success: true,
        message: 'Roles fetched successfully',
        data: roles,
      }

  }

  public async getRole({ request }: HttpContextContract) {
    const { key } = await request.validate(GetRoleValidator)

      const role = await roleRepository.findByKey(key)

      return {
        success: true,
        message: 'Role fetched successfully',
        data: role,
      }
  }

  public async postRole({ request }: HttpContextContract) {
    const data = await request.validate(CreateRoleValidator)

      const role = await roleRepository.createRole(data)

      return {
        success: true,
        message: 'Role created successfully',
        data: role,
      }
  }

public async setupRole({ request }: HttpContextContract) {
  const data = await request.validate(SetupRoleValidator)

  const trx = await Database.transaction()

  try {
    const result = await roleRepository.setupRole(data, trx)

    await trx.commit()

    return {
      success: true,
      message: 'Role setup completed successfully',
      data: result,
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

  public async updateRole({ request }: HttpContextContract) {
      const data = await request.validate(UpdateRoleValidator)
      const { key, ...newData } = data
      const role = await roleRepository.updateRole(key, newData)

      return {
  success: true,
  message: 'Role updated successfully',
  data: role,
}

  }

  public async deleteRole({ request}: HttpContextContract) {
      let roles
      const { key, updatestatus } = await request.validate(DeleteRoleValidator)

      if (!updatestatus) {
        roles = await roleRepository.disableRole(key)
      } else {
        roles = await roleRepository.enableRole(key)
      }

      return {
        success: true,
        message: updatestatus ? 'Role enabled successfully' : 'Role disabled successfully',
        data: roles,
      }
  }
}
