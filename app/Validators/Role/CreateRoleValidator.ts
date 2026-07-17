import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateRoleValidator {
  public schema = schema.create({
    key: schema.string([rules.maxLength(100)]),

    name: schema.string([rules.maxLength(100)]),

    description: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'key.required': 'Role key is required',
    'name.required': 'Role name is required',
    'key.maxLength': 'Role key must not exceed 100 characters',
    'name.maxLength': 'Role name must not exceed 100 characters',
  }
}
