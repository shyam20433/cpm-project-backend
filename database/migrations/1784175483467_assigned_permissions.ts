import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssignedPermissions extends BaseSchema {
  protected tableName = 'assigned_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('role_key').references('key').inTable('roles').notNullable()

      table.string('permission_key').references('key').inTable('permissions').notNullable()

      table.primary(['role_key', 'permission_key'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
