import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Item from 'App/Models/Item'

export default class Wishlist extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public url: string

    @column()
    public description: string

    @column()
    public userId: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => User, { serializeAs: 'user' })
    public user: BelongsTo<typeof User>

    @hasMany(() => Item)
    public items: HasMany<typeof Item>
}
