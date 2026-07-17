import { schema } from '@ioc:Adonis/Core/Validator'

export default class CreateAssignedEndpointValidator {
  public schema = schema.create({
    endpointId: schema.number(),

    permissionKey: schema.string(),
  })

  public messages = {
    'endpointId.required': 'Endpoint ID is required',
    'endpointId.number': 'Endpoint ID must be a number',

    'permissionKey.required': 'Permission key is required',
  }
}
