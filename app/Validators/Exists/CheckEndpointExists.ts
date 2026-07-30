import Endpoint from 'App/Models/Endpoint'
import { Exception } from '@adonisjs/core/build/standalone'

export default class CheckEndpointExists {
  public static async validate(endpointId: number) {
    const endpoint = await Endpoint.find(endpointId)

    if (!endpoint) {
      throw new Exception(
        'Endpoint does not exist',
        404,
        'E_ENDPOINT_NOT_FOUND'
      )
    }
    if (!endpoint.status) {
      throw new Exception(
        'Endpoint is Inactive',
        400,
        'E_ENDPOINT_INACTIVE'
      )
    }

    return endpoint
  }
}
