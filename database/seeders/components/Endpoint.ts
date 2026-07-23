import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Endpoint from 'App/Models/Endpoint'

export default class EndpointsSeeder extends BaseSeeder {
  public async run() {
    await Endpoint.updateOrCreateMany(['method', 'route'], [
      {
        method: 'GET',
        route: '/endpoints/access-details',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/endpoints',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/endpoints/:id',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/endpoints',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/endpoints/:id',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/endpoints/:id',
        serviceId: 1,
        status: true,
      },

      {
        method: 'GET',
        route: '/roles',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/roles/:key',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/roles',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/roles/:key',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/roles/:key',
        serviceId: 1,
        status: true,
      },

      {
        method: 'GET',
        route: '/permissions',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/permissions/:key',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/permissions',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/permissions/:key',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/permissions/:key',
        serviceId: 1,
        status: true,
      },

      {
        method: 'GET',
        route: '/assigned-roles',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/assigned-roles/:id',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/assigned-roles',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/assigned-roles/:id',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/assigned-roles/:id',
        serviceId: 1,
        status: true,
      },

      {
        method: 'GET',
        route: '/assigned-permissions',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/assigned-permissions/:roleKey/:permissionKey',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/assigned-permissions',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/assigned-permissions/:roleKey/:permissionKey',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/assigned-permissions/:roleKey/:permissionKey',
        serviceId: 1,
        status: true,
      },

      {
        method: 'GET',
        route: '/assigned-endpoints',
        serviceId: 1,
        status: true,
      },
      {
        method: 'GET',
        route: '/assigned-endpoints/:endpointId/:permissionKey',
        serviceId: 1,
        status: true,
      },
      {
        method: 'POST',
        route: '/assigned-endpoints',
        serviceId: 1,
        status: true,
      },
      {
        method: 'PUT',
        route: '/assigned-endpoints/:endpointId/:permissionKey',
        serviceId: 1,
        status: true,
      },
      {
        method: 'DELETE',
        route: '/assigned-endpoints/:endpointId/:permissionKey',
        serviceId: 1,
        status: true,
      },

      {
        method: 'POST',
        route: '/login',
        serviceId: 1,
        status: true,
      },
    ])
  }
}
