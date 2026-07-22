import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedEndpoint from 'App/Models/AssignedEndpoint'
export default class AssignedEndpointSeeder extends BaseSeeder {
  public async run() {
    await AssignedEndpoint.updateOrCreateMany(
      ['endpointId', 'permissionKey'],
      [
        {
          endpointId: 1,
          permissionKey: 'ORDER_READ',
        },
        {
          endpointId: 2,
          permissionKey: 'ORDER_CREATE',
        },
        {
          endpointId: 3,
          permissionKey: 'ORDER_UPDATE',
        },
        {
          endpointId: 4,
          permissionKey: 'ORDER_DELETE',
        },
      ]
    )
    // Write your database queries inside the run method
  }
}
