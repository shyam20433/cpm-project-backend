import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Endpoint from './Endpoint'
import Permission from './Permission'

export default class AssignedEndpoint extends BaseModel {
  public static table = 'assigned_endpoints'

  @column({ isPrimary: true, columnName: 'endpointId' })
  public endpointId!: number

  @column({ isPrimary: true, columnName: 'permissionKey' })
  public permissionKey!: string

  @belongsTo(() => Endpoint, {
    foreignKey: 'endpointId',
    localKey: 'id',
  })
  public endpoint!: BelongsTo<typeof Endpoint>

  @belongsTo(() => Permission, {
    foreignKey: 'permissionKey',
    localKey: 'key',
  })
  public permission!: BelongsTo<typeof Permission>

  @column.dateTime({ autoCreate: true, columnName: 'createdAt' })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updatedAt' })
  public updatedAt!: DateTime
}
