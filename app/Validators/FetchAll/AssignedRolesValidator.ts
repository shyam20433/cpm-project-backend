import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignedRolesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sort: schema.string.optional({}, [rules.regex(/^-?(endpointId|permissionKey)$/)]),
  })

  public messages = {
    'sort.regex': 'Sort must be one of: endpointId, permissionKey, -endpointId, -permissionKey',
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
