import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Wishlist from 'App/Models/Wishlist'
import Item from 'App/Models/Item'

export default class itemsController {
    public async index({}: HttpContextContract) {}

    public async store({ request, auth }: HttpContextContract) {
        //items require a name a topicId
        const itemSchema = schema.create({
            name: schema.string({ trim: true }, [rules.minLength(5), rules.maxLength(70)]),
            url: schema.string({}, [rules.maxLength(500), rules.minLength(3)]),
            desc: schema.string({}, [rules.maxLength(500), rules.minLength(3)]),
            wishlistId: schema.number(),
        })
        const itemPayload = await request.validate({ schema: itemSchema })
        //make sure the topicId belongs to an actual topic
        const wishlist = await Wishlist.findOrFail(itemPayload.wishlistId)
        const item = new Item()
        item.name = itemPayload.name
        //this is required because the associate functions below
        //try to insert to the database
        //even though it shouldn't
        item.url = itemPayload.url
        item.desc = itemPayload.desc
        item.userId = auth.user!.id
        //associate the item with the topic
        await item.related('wishlist').associate(wishlist)
        //associate the item with the user that is creating it
        await item.related('user').associate(auth.user!)
        //save the item
        await item.save()
        //load in relations
        await item.load('user')
        await item.load('wishlist')
        return item
    }

    public async show({params}: HttpContextContract) {
        const item = await Item.findOrFail(params.id);
        await item.load("user");
        await item.load("wishlist");
        return item;
    }

    public async update({request, params, bouncer}: HttpContextContract) {
        //get the item
        const item = await Item.findOrFail(params.id);
        const itemSchema = schema.create({
        name: schema.string({trim: true}, [rules.minLength(5), rules.maxLength(70)]),
        });
        const itemPayload = await request.validate({schema: itemSchema});
        await bouncer.authorize("updateItem", item);
        item.name = itemPayload.name;
        await item.save();
        return item;
    }

    public async destroy({params, bouncer}: HttpContextContract) {
        const item = await Item.findOrFail(params.id);
        await bouncer.authorize("deleteItem", item);
        await item.delete();
        return item;
    }
}
