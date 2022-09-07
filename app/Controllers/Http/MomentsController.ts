//módulo para realizar requisição
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application"
import {v4 as uuidv4} from 'uuid'

import Moment from 'App/Models/Moment'
// import databaseConfig from 'Config/database'
// import { Request } from '@adonisjs/core/build/standalone'

export default class MomentsController {
    
    //criando uma validação para a imagem
    private validateOptions ={
        types: ['image'], //tipo que irá aceitar 
        size: '2mb', //tamanho que irá aceitar
    }

    //utilizamos request e response utilizando o httpcontextContratc
    public async store({request, response}: HttpContextContract){


        
        //resgatamos o body
        const body = request.body();
        
        //resgata a imagem
        const image = request.file('image', this.validateOptions)

        //valida se existe uma imagem e executa uma ação
        if(image){
            //definição do nome da imagem
            const imgName = `${uuidv4()}.${image.extname}`

            // move para uma pasta onder será armazenado o arquivo
            await image.move(Application.tmpPath('uploads'),{
                name: imgName
            })

            //salvando no banco com o nome que criamos
            body.image = imgName;
        }

        //inserimos os dados no banco chamando a model criada
        const moment = await Moment.create(body);
        
        //definimos um response 
        response.status(201)

        return {
            message:'Dados inseridos com sucesso',
            data: moment,
        }
    }


    //Retorna todos os dados da model moment
    public async index(){
        const moments = await Moment.query().preload('comments');
        return{
            data: moments,
        }
    }

    //retorna um paramentro por meio de um parametro, desse caso id
    public async show({params} :HttpContextContract){

        const moment = await Moment.findOrFail(params.id)

        await moment.load('comments')

        return{
            data: moment
        }

    }

    public async destroy({params} :HttpContextContract){
        const moment = await Moment.findOrFail(params.id)

        await moment.delete();

        return{
            message: 'Delete realizado com sucesso',
            return: moment
        }
    }

    //faz o update
    public async update({params, request, response} :HttpContextContract){
        const body = request.body()
        const moment = await Moment.findOrFail(params.id)

        moment.tittle = body.tittle
        moment.description = body.description

        //também está certo
        // moment.tittle = request.input('name')
        // moment.description = request.input('description')
        
        if(moment.image != body.image || !moment.image){
            const image = request.file('image', this.validateOptions)

            if(image){
                const imgName = `${uuidv4()}.${image.extname}`
                
                await image.move(Application.tmpPath('uploads'),{
                    name: imgName
                })

                moment.image = imgName;
            }
        }

        await moment.save()

        response.status(201)

        return{
            message: 'Dados alterados com sucesso.',
            return: moment
        }

    }


}
