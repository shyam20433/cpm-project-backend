import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class GetAccessDetailsValidator {
  public schema = schema.create({
    service_id: schema.number(),

    method: schema.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const),

    route: schema.string({}, [rules.trim()]),
  })

  public messages = {
    'service_id.required': 'Service ID is required',
    'service_id.number': 'Service ID must be a number',

    'method.required': 'Method is required',
    'method.enum': 'Method must be GET, POST, PUT, PATCH or DELETE',

    'route.required': 'Route is required',
    'route.string': 'Route must be a string',
  }
}
