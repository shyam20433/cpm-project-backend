import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateAssignedPermissionValidator {
  public schema = schema.create({
    roleKey: schema.string(),

    permissionKey: schema.string(),
  })

  public messages = {
    'roleKey.required': 'Role key is required',

    'permissionKey.required': 'Permission key is required',
  }
}
