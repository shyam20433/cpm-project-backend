import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class GetAccessDetailsValidator {
  public schema = schema.create({
    serviceId: schema.number(),

    method: schema.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const),

    route: schema.string({}, [rules.trim()]),
    include: schema.enum.optional(['all'] as const),
  })

  public messages = {
    'serviceId.required': 'Service ID is required',
    'serviceId.number': 'Service ID must be a number',

    'method.required': 'Method is required',
    'method.enum': 'Method must be GET, POST, PUT, PATCH or DELETE',

    'route.required': 'Route is required',
    'route.string': 'Route must be a string',
  }
}
