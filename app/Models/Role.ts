import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Permission from './Permission'

export default class Role extends BaseModel {
  public static table = 'roles'

  @column({ isPrimary: true })
  public key!: string

  @column()
  public name!: string

  @column()
  public description!: string

  @column()
  public status!: boolean

  @manyToMany(() => Permission, {
    pivotTable: 'assigned_permissions',
    localKey: 'key',
    pivotForeignKey: 'role_key',
    relatedKey: 'key',
    pivotRelatedForeignKey: 'permission_key',
  })
  public permissions!: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
