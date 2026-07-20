import Endpoint from 'App/Models/Endpoint'

export default class CheckEndpointExists {
  public static async validate(serviceId: number) {
    const endpoint = await Endpoint.find(serviceId)

    if (!endpoint) {
      throw new Error('Endpoint does not exist')
    }

    return endpoint
  }
}
