import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssignedPermissions extends BaseSchema {
  protected tableName = 'assigned_permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('roleKey').references('key').inTable('roles').notNullable()

      table.string('permissionKey').references('key').inTable('permissions').notNullable()

      table.primary(['roleKey', 'permissionKey'])
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
