import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    await Role.updateOrCreateMany(['key'], [
      {
        key: 'ADMIN',
        name: 'Administrator',
        description: 'System Administrator',
        status: true,
      },
      {
        key: 'USER',
        name: 'User',
        description: 'Application User',
        status: true,
      },
      {
        key: 'UPLOADER',
        name: 'creater',
        description: 'Creater endpoints',
        status: true,
      },
      {
        key: 'MANAGER',
        name: 'management',
        description: 'Manages endpoints',
        status: true,
      },
    ])
  }
}
