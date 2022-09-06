//módulo para realizar requisição
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from "@ioc:Adonis/Core/Application"
import {v4 as uuidv4} from 'uuid'

import Moment from 'App/Models/Moment'

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
        const moments = await Moment.all();
        return{
            data: moments,
        }
    }

    //retorna um paramentro por meio de um parametro, desse caso id
    public async show({params} :HttpContextContract){

        const moment = await Moment.findOrFail(params.id)

        return{
            data: moment
        }

    }


}
