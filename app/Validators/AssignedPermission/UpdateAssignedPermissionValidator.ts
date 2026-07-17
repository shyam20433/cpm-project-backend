import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateAssignedPermissionValidator {
  public schema = schema.create({
    roleKey: schema.string.optional(),

    permissionKey: schema.string.optional(),
  })
}
