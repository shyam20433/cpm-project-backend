import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateAssignedRoleValidator {
  public schema = schema.create({
    userId: schema.number(),

    roleKey: schema.string(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'userId.required': 'User ID is required',
    'userId.number': 'User ID must be a number',

    'roleKey.required': 'Role key is required',
  }
}
