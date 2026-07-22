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
  public reportUnknownFields = true
  public static validateQueryParams(qs: any) {
    const allowedParams = ['sort']
    const unknownParams = Object.keys(qs).filter((key) => !allowedParams.includes(key))

    if (unknownParams.length > 0) {
      throw new Error(
        `Unknown fields: ${unknownParams.join(', ')}. Allowed: ${allowedParams.join(', ')}`
      )
    }

    return true
  }
}
