import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Permission from './Permission'

export default class Endpoint extends BaseModel {
  public static table = 'endpoints'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public method!: string

  @column()
  public route!: string

  @column()
  public serviceId!: number

  @column()
  public status!: boolean

  @manyToMany(() => Permission, {
    pivotTable: 'assigned_endpoints',
    localKey: 'id',
    pivotForeignKey: 'endpointId',
    relatedKey: 'key',
    pivotRelatedForeignKey: 'permissionKey',
  })
  public permissions!: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
