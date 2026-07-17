import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteAssignedPermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public data = this.ctx.request.params()

  public schema = schema.create({
    roleKey: schema.string(),

    permissionKey: schema.string(),
  })

  public messages = {
    'roleKey.required': 'Role key is required',

    'permissionKey.required': 'Permission key is required',
  }
}
