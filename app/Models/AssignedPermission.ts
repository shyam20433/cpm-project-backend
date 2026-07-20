import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Permission from './Permission'

export default class AssignedPermission extends BaseModel {
  public static table = 'assigned_permissions'

  @column({ isPrimary: true, columnName: 'roleKey', serializeAs: 'roleKey' })
  public roleKey!: string

  @column({ isPrimary: true, columnName: 'permissionKey', serializeAs: 'permissionKey' })
  public permissionKey!: string

  @belongsTo(() => Role, {
    foreignKey: 'roleKey',
    localKey: 'key',
  })
  public role!: BelongsTo<typeof Role>

  @belongsTo(() => Permission, {
    foreignKey: 'permissionKey',
    localKey: 'key',
  })
  public permission!: BelongsTo<typeof Permission>

  @column.dateTime({ autoCreate: true, columnName: 'createdAt', serializeAs: 'createdAt' })
  public createdAt!: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    columnName: 'updatedAt',
    serializeAs: 'updatedAt',
  })
  public updatedAt!: DateTime
}
