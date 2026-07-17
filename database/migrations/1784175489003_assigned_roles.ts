import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AssignedRoles extends BaseSchema {
  protected tableName = 'assigned_roles'
  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('role_key').notNullable().references('key').inTable('roles')
      table.string('email').notNullable()
      table.unique(['role_key', 'email'])
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
