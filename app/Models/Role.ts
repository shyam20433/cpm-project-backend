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
    pivotForeignKey: 'roleKey',
    relatedKey: 'key',
    pivotRelatedForeignKey: 'permissionKey',
  })
  public permissions!: ManyToMany<typeof Permission>

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
