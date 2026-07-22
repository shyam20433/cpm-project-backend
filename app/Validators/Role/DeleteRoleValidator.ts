import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeleteRoleValidator {
  constructor(protected ctx: HttpContextContract) { }

  public get data() {
    return {
      key: this.ctx.request.param('key'),
      ...this.ctx.request.qs(),
    }
  }

  public schema = schema.create({
    key: schema.string([rules.required()]),
    updatestatus: schema.boolean.optional(),
  })

  public messages = {
    'key.required': 'Role key is required',
  }
}
