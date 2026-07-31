import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AuditLogs extends BaseSchema {
  protected tableName = 'audit_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('tableName').notNullable()
      table.string('recordId').notNullable()
      table.string('action').notNullable()

      table.jsonb('oldData').nullable()
      table.jsonb('newData').nullable()

      table.string('changedBy').notNullable()

      table.timestamp('createdAt', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
