import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpMethod } from 'App/Enums/HttpMethod'
export default class CreateEndpointValidator {
  public schema = schema.create({
    method: schema.enum(Object.values(HttpMethod)),

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
