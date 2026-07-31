import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import PermissionRepository from 'App/Repositories/PermissionRepository'

import IsIncludeValidator from 'App/Validators/FetchAll/IsIncludeValidator'
import CreatePermissionValidator from 'App/Validators/Permission/CreatePermissionValidator'
import DeletePermissionValidator from 'App/Validators/Permission/DeletePermissionValidator'
import UpdatePermissionValidator from 'App/Validators/Permission/UpdatePermissionValidator'
import GetPermissionValidator from 'App/Validators/Permission/GetPermissionValidator'

const permissionRepository = new PermissionRepository()

export default class PermissionsController {
  public async getPermissions({ request }: HttpContextContract) {
      const filters = await request.validate(IsIncludeValidator)
      const permissions = await permissionRepository.getAll(filters)
      return {
        success: true,
        message: 'Permissions fetched successfully',
        data: permissions,
      }
  }

  public async getPermission({ request }: HttpContextContract) {
    const { key } = await request.validate(GetPermissionValidator)

      const permission = await permissionRepository.findByKey(key)
      return {
        success: true,
        message: 'Permission fetched successfully',
        data: permission,
      }
  }

public async postPermission({ request, response }: HttpContextContract) {
  const trx = await Database.transaction()

  try {
    const data = await request.validate(CreatePermissionValidator)

    const changedBy = request.authUser!.email

    const permission = await permissionRepository.createPermission(
      data,
      changedBy,
      trx
    )

    await trx.commit()

    return {
      success: true,
      message: 'Permission created successfully',
      data: permission,
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

public async updatePermission({ request }: HttpContextContract) {
  const trx = await Database.transaction()

  try {
    const data = await request.validate(UpdatePermissionValidator)

    const { key, ...newData } = data

    const changedBy = request.authUser!.email

    const permission = await permissionRepository.updatePermission(
      key,
      newData,
      changedBy,
      trx
    )

    await trx.commit()

    return {
      success: true,
      message: 'Permission updated successfully',
      data: permission,
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
}

public async deletePermission({ request }: HttpContextContract) {
  const trx = await Database.transaction()

  try {
    const { key, updatestatus } = await request.validate(
      DeletePermissionValidator
    )

    const changedBy = request.authUser!.email

    let permission

    if (!updatestatus) {
      permission = await permissionRepository.disablePermission(
        key,
        changedBy,
        trx
      )
    } else {
      permission = await permissionRepository.enablePermission(
        key,
        changedBy,
        trx
      )
    }

    await trx.commit()

    return {
      success: true,
      message: updatestatus
        ? 'Permission enabled successfully'
        : 'Permission disabled successfully',
      data: permission,
    }
  } catch (error) {
    await trx.rollback()
    throw error
  }
}
}
