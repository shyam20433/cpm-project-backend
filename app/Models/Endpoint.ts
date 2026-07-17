import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Permission from './Permission'

export default class Endpoint extends BaseModel {
  public static table = 'endpoints'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public method!: string

  @column()
  public route!: string

  @column({ columnName: 'service_id' })
  public serviceId!: number

  @column({ columnName: 'permission_key' })
  public permissionKey!: string

  @column()
  public status!: boolean


  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
