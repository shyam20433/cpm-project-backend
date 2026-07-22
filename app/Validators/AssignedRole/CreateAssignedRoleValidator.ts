import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateAssignedRoleValidator {
  public schema = schema.create({
    email: schema.string({}, [rules.email()]),

    roleKey: schema.string(),
  })

  public messages = {
    'email.required': 'email is required',
    'email.email': 'enter valid email address',

    'roleKey.required': 'Role key is required',
  }
}
