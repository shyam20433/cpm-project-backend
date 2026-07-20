import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
export default class PermissionSeeder extends BaseSeeder {
  public async run() {
    await Permission.updateOrCreateMany('key', [
      {
        key: 'ORDER_READ',
        name: 'Read Orders',
        description: 'Allows viewing orders',
        status: true,
      },
      {
        key: 'ORDER_CREATE',
        name: 'Create Orders',
        description: 'Allows creating orders',
        status: true,
      },
      {
        key: 'ORDER_UPDATE',
        name: 'Update Orders',
        description: 'Allows updating orders',
        status: true,
      },
      {
        key: 'ORDER_DELETE',
        name: 'Delete Orders',
        description: 'Allows deleting orders',
        status: false,
      },
    ])
    // Write your database queries inside the run method
  }
}
