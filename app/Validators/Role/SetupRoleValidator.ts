import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetupRoleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    role: schema.object().members({
      key: schema.string({}, [
        rules.trim(),
      ]),

      name: schema.string({}, [
        rules.trim(),
      ]),

      description: schema.string({}, [
        rules.trim(),
      ]),

      status: schema.boolean(),
    }),

    permissions: schema.array().members(
      schema.string({}, [
        rules.trim(),
      ])
    ),

    email: schema.string({}, [
      rules.trim(),
      rules.email(),
    ]),
  })

  public messages = {
    'role.key.required': 'Role key is required',
    'role.name.required': 'Role name is required',
    'role.description.required': 'Role description is required',
    'role.status.required': 'Role status is required',

    'permissions.required': 'Permissions are required',
    'permissions.array': 'Permissions must be an array',

    'email.required': 'Email is required',
    'email.email': 'Invalid email address',
  }
}
