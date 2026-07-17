import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteEndpointValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number(),
  })

  public data = this.ctx.request.params()

  public messages = {
    'id.required': 'Endpoint id is required',
    'id.number': 'Endpoint id must be a number',
  }
}
