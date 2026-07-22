import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteEndpointValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required()]),
    updatestatus: schema.boolean.optional(),
  })

  public messages = {
    'id.required': 'Endpoint id is required',
    'id.number': 'Endpoint id must be a number',
    'updatestatus.boolean': 'updatestatus must be true or false',
  }

  public get data() {
    return {
      id: Number(this.ctx.request.param('id')),
      ...this.ctx.request.qs(),
    }
  }
}
