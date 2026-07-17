import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'

export default class AssignedRole extends BaseModel {
  public static table = 'assigned_roles'

  @column({ isPrimary: true })
  public id!: number

  @column({ columnName: 'role_key' })
  public roleKey!: string

  @column()
  public email!: string

  @belongsTo(() => Role, {
    foreignKey: 'roleKey',
    localKey: 'key',
  })
  public role!: BelongsTo<typeof Role>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
