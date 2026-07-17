import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdatePermissionValidator {
  public schema = schema.create({
    name: schema.string.optional([rules.maxLength(100)]),

    description: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'name.maxLength': 'Permission name must not exceed 100 characters',
  }
}
