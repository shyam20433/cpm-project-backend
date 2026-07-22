import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignedPermissionsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sort: schema.string.optional({}, [rules.regex(/^-?(roleKey|permissionKey)$/)]),
  })

  public messages = {
    'sort.regex': 'Sort must be one of: roleKey, permissionKey, -roleKey, -permissionKey',
  }
}
