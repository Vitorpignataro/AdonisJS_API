import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class ProductsController {

    // Cria produtos
    public async store({request, response} :HttpContextContract){
        const body = await request.body()

        await Product.create(body)
        response.status(201)

        return{
            message: "cadastro executado com sucesso",
            data: body
        }
    }

    //pega todos os casos
    public async index(){
        const products = await Product.all()

        return{
            data: products
        }
    }

    //busca por id
    public async show({params} :HttpContextContract){
        const product = await Product.findOrFail(params.id);

        return{
            data: product
        }
    }

    //deleta por ID
    public async destroy({params} :HttpContextContract){
        const product = await Product.findOrFail(params.id)

        await product.delete()

        return{
            message: `O product ${product.product_name} foi deletado`,
            data: product
        }
    }

    //update
    public async update({params, request} :HttpContextContract){
        const body = request.body();
        const product = await Product.findOrFail(params.id)

        product.product_name = body.product_name;
        product.price = body.price;

        product.save()

        return{
            message: `Produto alterado com sucesso!`,
            data: body
        }
    }

}
