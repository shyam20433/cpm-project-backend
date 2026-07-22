import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateEndpointValidator {
  public schema = schema.create({
    method: schema.enum.optional(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const),

    route: schema.string.optional({}, [rules.maxLength(255)]),

    serviceId: schema.number.optional(),

    status: schema.boolean.optional(),
  })
  public messages = {
    'method.enum': 'Invalid HTTP method',
  }
}
