import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignedRolesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sort: schema.string.optional({}, [rules.regex(/^-?(id|email|roleKey)$/)]),
  })

  public messages = {
    'sort.regex': 'Sort must be one of: id, email, roleKey, -id, -email, -roleKey',
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
