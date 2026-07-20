import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import RoleSeeder from './components/Role'
import PermissionSeeder from './components/Permission'
import EndpointSeeder from './components/Endpoint'
import AssignedPermissionSeeder from './components/AssignedPermission'
import AssignedEndpointSeeder from './components/AssignedEndpoint'
import AssignedRoleSeeder from './components/AssignedRole'

export default class DatabaseSeeder extends BaseSeeder {
  public async run() {
    await new RoleSeeder(this.client).run()
    await new PermissionSeeder(this.client).run()
    await new EndpointSeeder(this.client).run()
    await new AssignedPermissionSeeder(this.client).run()
    await new AssignedEndpointSeeder(this.client).run()
    await new AssignedRoleSeeder(this.client).run()
  }
}
