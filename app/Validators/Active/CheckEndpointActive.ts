import Endpoint from 'App/Models/Endpoint'
export default class CheckEndpointActive {
  public static async validate(endpointId: number) {
    const endpoint = await Endpoint.find(endpointId)

    if (!endpoint) {
      throw new Error('endpoint not found')
    }
    if (!endpoint?.status) {
      throw new Error('Endpoint is inactive')
    }

    return endpoint
  }
}
