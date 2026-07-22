import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdatePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    key: schema.string([rules.required()]),
    name: schema.string.optional([rules.maxLength(100)]),

    description: schema.string.optional(),

    status: schema.boolean.optional(),
  })

  public messages = {
    'name.maxLength': 'Permission name must not exceed 100 characters',
  }
    public get data() {
    return {
      key: this.ctx.request.param('key'),
      ...this.ctx.request.body(),
    }
  }
}
