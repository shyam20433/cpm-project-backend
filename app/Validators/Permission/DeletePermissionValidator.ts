import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeletePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    key: schema.string({}, [rules.required()]),
    updatestatus: schema.boolean.optional(),
  })

  public messages = {
    'key.required': 'Permission key is required',
  }
  public get data() {
    return {
      key: this.ctx.request.param('key'),
      ...this.ctx.request.qs(),
    }
  }
}
