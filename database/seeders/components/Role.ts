import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run() {
    await Role.updateOrCreateMany('key', [
      {
        key: 'MANAGER',
        name: 'Manager',
        description: 'Department manager',
        status: true,
      },
      {
        key: 'EMPLOYEE',
        name: 'Employee',
        description: 'Regular employee',
        status: true,
      },
      {
        key: 'ADMIN',
        name: 'Administrator',
        description: 'System administrator',
        status: true,
      },
    ])
  }
}
