import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetupAllValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    role: schema.object().members({
      key: schema.string({}, [rules.trim()]),
      name: schema.string({}, [rules.trim()]),
      description: schema.string({}, [rules.trim()]),
      status: schema.boolean(),
    }),

    permission: schema.object().members({
      key: schema.string({}, [rules.trim()]),
      name: schema.string({}, [rules.trim()]),
      description: schema.string({}, [rules.trim()]),
      status: schema.boolean(),
    }),

    endpoint: schema.object().members({
      serviceId: schema.number(),

      route: schema.string({}, [rules.trim()]),

      method: schema.enum([
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
      ] as const),

      status: schema.boolean(),
    }),

    email: schema.string({}, [
      rules.trim(),
      rules.email(),
    ]),
  })

  public messages = {
    required: '{{ field }} is required',
    'email.email': 'Invalid email',
  }
}
