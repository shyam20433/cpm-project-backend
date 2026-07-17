import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAssignedEndpointValidator {
  constructor(protected ctx: HttpContextContract) {}

  public data = this.ctx.request.params()

  public schema = schema.create({
    endpointId: schema.number(),

    permissionKey: schema.string(),
  })

  public messages = {
    'endpointId.required': 'Endpoint ID is required',
    'endpointId.number': 'Endpoint ID must be a number',

    'permissionKey.required': 'Permission key is required',
  }
}
