import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateAssignedRoleValidator {
  public schema = schema.create({
    email: schema.string.optional([rules.email()]),

    roleKey: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'userId.number': 'User ID must be a number',
    'email.email': 'Enter a valid email address',
  }
}
