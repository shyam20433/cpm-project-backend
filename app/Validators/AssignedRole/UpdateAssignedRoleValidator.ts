import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateAssignedRoleValidator {
  public schema = schema.create({
    userId: schema.number.optional(),

    roleKey: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'userId.number': 'User ID must be a number',
  }
}
