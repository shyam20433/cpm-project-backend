import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateRoleValidator {
  public schema = schema.create({
    name: schema.string.optional([rules.maxLength(100)]),

    description: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'name.maxLength': 'Role name must not exceed 100 characters',
  }
}
