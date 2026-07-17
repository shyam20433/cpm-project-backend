import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Permission from './Permission'

export default class AssignedPermission extends BaseModel {
  public static table = 'assigned_permissions'

  @column({ isPrimary: true, columnName: 'role_key' })
  public roleKey!: string

  @column({ isPrimary: true, columnName: 'permission_key' })
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

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
