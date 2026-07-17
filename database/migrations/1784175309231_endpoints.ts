import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Endpoints extends BaseSchema {
  protected tableName = 'endpoints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('method', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).notNullable()
      table.string('route').notNullable()
      table.unique(['method', 'route'])
      table.integer('service_id').notNullable().unsigned()
      table.boolean('status').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
