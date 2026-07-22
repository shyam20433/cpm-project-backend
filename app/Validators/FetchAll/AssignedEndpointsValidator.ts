import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssignedEndpointsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    sort: schema.string.optional({}, [rules.regex(/^-?(endpointId|permissionKey)$/)]),
  })

  public messages = {
    'sort.regex': 'Sort must be one of: endpointId, permissionKey, -endpointId, -permissionKey',
  }
}
