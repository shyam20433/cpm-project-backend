import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAssignedRoleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public data = this.ctx.request.params()

  public schema = schema.create({
    id: schema.number(),
  })

  public messages = {
    'id.required': 'Assigned Role ID is required',
    'id.number': 'Assigned Role ID must be a number',
  }
}
