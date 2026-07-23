import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpMethod } from 'App/Enums/HttpMethod'
export default class UpdateEndpointValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required()]),

    method: schema.enum.optional(Object.values(HttpMethod)),
    route: schema.string.optional({}, [rules.maxLength(255)]),
    serviceId: schema.number.optional(),
    status: schema.boolean.optional(),
  })

  public messages = {
    'id.required': 'Endpoint ID is required',
    'id.number': 'Endpoint ID must be a number',
    'method.enum': 'Invalid HTTP method. Must be GET, POST, PUT, PATCH, or DELETE',
    'route.maxLength': 'Route cannot exceed 255 characters',
  }
  public get data() {
    return {
      id: Number(this.ctx.request.param('id')),
      ...this.ctx.request.body(),
    }
  }
}
