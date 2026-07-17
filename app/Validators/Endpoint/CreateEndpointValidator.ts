import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateEndpointValidator {
  public schema = schema.create({
    method: schema.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const),

    route: schema.string({}, [rules.maxLength(255)]),

    serviceId: schema.number(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'method.required': 'Method is required',
    'route.required': 'Route is required',
    'serviceId.required': 'Service ID is required',
  }
}
