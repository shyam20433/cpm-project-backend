import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateAssignedEndpointValidator {
  public schema = schema.create({
    endpointId: schema.number.optional(),

    permissionKey: schema.string.optional(),
  })

  public messages = {
    'endpointId.number': 'Endpoint ID must be a number',
  }
}
