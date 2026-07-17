import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreatePermissionValidator {
  public schema = schema.create({
    key: schema.string([rules.maxLength(100)]),

    name: schema.string([rules.maxLength(100)]),

    description: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'key.required': 'Permission key is required',
    'name.required': 'Permission name is required',
    'key.maxLength': 'Permission key must not exceed 100 characters',
    'name.maxLength': 'Permission name must not exceed 100 characters',
  }
}
