import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AuditLog extends BaseModel {
  public static table = 'audit_logs'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'tableName' })
  public tableName!: string

  @column({ columnName: 'recordId' })
  public recordId!: string

  @column({ columnName: 'action' })
  public action!: string

  @column({
    columnName: 'oldData',
    consume: (value) => value,
    prepare: (value) => value,
  })
  public oldData: any

  @column({
    columnName: 'newData',
    consume: (value) => value,
    prepare: (value) => value,
  })
  public newData: any

  @column({ columnName: 'changedBy' })
  public changedBy!: string

  @column.dateTime({
    columnName: 'createdAt',
    autoCreate: true,
  })
  public createdAt!: DateTime
}
