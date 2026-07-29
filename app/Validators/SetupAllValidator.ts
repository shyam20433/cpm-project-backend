import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetupAllValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
  roleKey:  schema.array().members(schema.string({}, [rules.trim()])),

    permission: schema.object().members({
      key: schema.string({}, [rules.trim()]),
      name: schema.string({}, [rules.trim()]),
      description: schema.string.optional({}, [rules.trim()]),
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

  })

public messages = {
  required: '{{ field }} is required',
}
}
