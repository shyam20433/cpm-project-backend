import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { HttpMethod } from 'App/Enums/HttpMethod'
export default class Endpoints extends BaseSchema {
  protected tableName = 'endpoints'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('method',Object.values(HttpMethod)).notNullable()
      table.string('route').notNullable()
      table.unique(['method', 'route'])
      table.integer('serviceId').notNullable().unsigned()
      table.boolean('status').defaultTo(true)
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
