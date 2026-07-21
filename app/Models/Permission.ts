import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Endpoint from './Endpoint'

export default class Permission extends BaseModel {
  public static table = 'permissions'

  @column({ isPrimary: true })
  public key!: string

  @column()
  public name!: string

  @column()
  public description!: string

  @column()
  public status!: boolean

  @manyToMany(() => Role, {
    pivotTable: 'assigned_permissions',
    localKey: 'key',
    pivotForeignKey: 'permissionKey',
    relatedKey: 'key',
    pivotRelatedForeignKey: 'roleKey',
  })
  public roles!: ManyToMany<typeof Role>

  @manyToMany(() => Endpoint, {
    pivotTable: 'assigned_endpoints',
    localKey: 'key',
    pivotForeignKey: 'permissionKey',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'endpointId',
  })
  public endpoints!: ManyToMany<typeof Endpoint>

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
