import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssignedEndpoints extends BaseSchema {
  protected tableName = 'assigned_endpoints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('endpoint_id').unsigned().references('id').inTable('endpoints').notNullable()
      table.string('permission_key').references('key').inTable('permissions').notNullable()
      table.primary(['endpoint_id', 'permission_key'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
