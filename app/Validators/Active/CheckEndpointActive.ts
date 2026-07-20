import Endpoint from 'App/Models/Endpoint'
export default class CheckEndpointActive {
  public static async validate(roleKey: number) {
    const endpoint = await Endpoint.find(roleKey)

    if (!endpoint) {
      throw new Error('endpoint not found')
    }
    if (!endpoint?.status) {
      throw new Error('endpoint is active ')
    }

    return endpoint
  }
}
