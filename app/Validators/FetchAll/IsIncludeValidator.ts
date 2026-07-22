import { schema } from '@ioc:Adonis/Core/Validator'

export default class IsIncludeValidator {
  public schema = schema.create({
    include: schema.enum.optional(['all'] as const),
    sort: schema.string.optional(),
  })

  public messages = {
    'include.enum': 'Include must be "all".',
  }
}
