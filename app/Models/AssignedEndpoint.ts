import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Endpoint from './Endpoint'
import Permission from './Permission'

export default class AssignedEndpoint extends BaseModel {
  public static table = 'assigned_endpoints'

  @column({ isPrimary: true, columnName: 'endpoint_id' })
  public endpointId!: number

  @column({ isPrimary: true, columnName: 'permission_key' })
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

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
