import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import Moment from 'App/Models/Moment'

export default class CommentsController {

    //Post -> cadastro de comentários
    public async store({request, response, params} :HttpContextContract){

        const body = await request.body()

        const momentId = params.momentId

        await Moment.findOrFail(momentId) 

        body.momentId = momentId

        const comment = await Comment.create(body);
        response.status(201)

        return{
            message: 'Cadastro realizado com sucesso',
            data: comment
        }
    }

    //get all -> trás tudo
    public async index(){
        const comments = await Comment.all()

        return{
            data: comments,
        }
    }

    //delete através do ID
    public async destroy({params} :HttpContextContract){
        const comment = await Comment.findOrFail(params.id)

        await comment.delete();

        return{
            message: `O cometário cujo id é ${params.id} foi deletado`,
            data: comment,
        }
    }

    //update do comentário através do ID
    public async update({params, request} :HttpContextContract){
        const body = request.body()
        const comment = await Comment.findOrFail(params.id)

        if(body.username != ''){
            comment.username = body.username
        }

        if(body.comment != ''){
            comment.comment = body.comment
        }

        comment.save();

        return{
            message: "Atualizado com Sucesso!",
            data: comment
        }



    }

    



}
