import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Endpoint from 'App/Models/Endpoint'

export default class EndpointSeeder extends BaseSeeder {
  public async run() {
    await Endpoint.updateOrCreateMany('id', [
      {
        id: 1,
        serviceId: 1,
        method: 'GET',
        route: '/orders',
        status: false,
      },
      {
        id: 2,
        serviceId: 1,
        method: 'POST',
        route: '/orders',
        status: true,
      },
      {
        id: 3,
        serviceId: 1,
        method: 'PUT',
        route: '/orders/:id',
        status: true,
      },
      {
        id: 4,
        serviceId: 1,
        method: 'DELETE',
        route: '/orders/:id',
        status: true,
      },
    ])
  }
}
