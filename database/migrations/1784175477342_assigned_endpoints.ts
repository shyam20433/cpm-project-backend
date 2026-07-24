import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssignedEndpoints extends BaseSchema {
  protected tableName = 'assigned_endpoints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('endpointId').unsigned().references('id').inTable('endpoints').notNullable()
      table.string('permissionKey').references('key').inTable('permissions').notNullable()
      table.primary(['endpointId', 'permissionKey'])
      table.timestamp("createdAt", { useTz: true }).defaultTo(this.now());
      table.timestamp("updatedAt", { useTz: true }).defaultTo(this.now());
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
