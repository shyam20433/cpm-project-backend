import Endpoint from 'App/Models/Endpoint'

export default class CheckEndpointExists {
  public static async validate(endpointId: number) {
    const endpoint = await Endpoint.find(endpointId)

    if (!endpoint) {
      throw new Error('Endpoint does not exist')
    }

    return endpoint
  }
}
