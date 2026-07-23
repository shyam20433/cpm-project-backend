import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AssignedRole from 'App/Models/AssignedRole'

export default class AssignedRoleSeeder extends BaseSeeder {
  public async run() {
    await AssignedRole.updateOrCreateMany(['roleKey', 'email'], [
      {
        roleKey: 'ADMIN',
        email: 'admin@gmail.com',
      },
      {
        roleKey: 'USER',
        email: 'user@gmail.com',
      },
      {
        roleKey: 'UPLOADER',
        email: 'uploader@gmail.com',
      },
      {
        roleKey: 'MANAGER',
        email: 'manager@gmail.com',
      },
    ])
  }
}
