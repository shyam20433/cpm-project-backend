import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeletePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public data = this.ctx.request.params()

  public schema = schema.create({
    key: schema.string(),
  })

  public messages = {
    'key.required': 'Permission key is required',
  }
}
