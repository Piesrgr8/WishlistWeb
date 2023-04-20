import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Wishlist from 'App/Models/Wishlist'

export default class WishlistsController {
    public async index({}: HttpContextContract) {
        const wishlists = await Wishlist.query().preload('user').orderBy('created_at')
        return wishlists
    }
    public async store({ request, auth }: HttpContextContract) {
        //create our schema we want a name and a description
        const wishlistsSchema = schema.create({
            name: schema.string({}, [rules.maxLength(50), rules.minLength(3)]),
            url: schema.string({}, [rules.maxLength(500), rules.minLength(3)]),
            description: schema.string({}, [rules.maxLength(500), rules.minLength(3)]),
        })
        //validate the schema
        const payload = await request.validate({ schema: wishlistsSchema })
        const newwishlist = new Wishlist()
        newwishlist.name = payload.name
        newwishlist.url = payload.url
        newwishlist.description = payload.description
        //associate the wishlist with the user that is creating it
        await newwishlist.related('user').associate(auth.user!)
        //save the new wishlist to the database
        await newwishlist.save()
        //load in the user information
        await newwishlist.load('user')
        return newwishlist
    }
    public async show({ params }: HttpContextContract) {
        const wishlist = await Wishlist.findOrFail(params.id)
        await wishlist.load('user')
        await wishlist.load('items')
        return wishlist
    }

    public async update({ bouncer, request, params }: HttpContextContract) {
        //create schema because we are updating both name and description are optional
        const updateSchema = schema.create({
            name: schema.string.optional({ trim: true }, [rules.maxLength(50), rules.minLength(3)]),
            url: schema.string.optional({ trim: true }, [rules.maxLength(500), rules.minLength(3)]),
            description: schema.string.optional({ trim: true }, [
                rules.maxLength(500),
                rules.minLength(3),
            ]),
        })
        const updatePayload = await request.validate({ schema: updateSchema })
        //get the wishlist
        const wishlist = await Wishlist.findOrFail(params.id)
        //verify the user made the wishlist
        await bouncer.authorize('updateWishlist', wishlist)
        //update the values
        wishlist.name = updatePayload.name ?? wishlist.name
        wishlist.url = updatePayload.url ?? wishlist.url
        wishlist.description = updatePayload.description ?? wishlist.description
        //save the wishlist
        await wishlist.save()
        //load in the user
        await wishlist.load('user')
        return wishlist
    }
    public async destroy({ params, bouncer }: HttpContextContract) {
        let wishlist = await Wishlist.findOrFail(params.id)
        await bouncer.authorize('deleteWishlist', wishlist)
        await wishlist.delete()
        return wishlist
    }
}
