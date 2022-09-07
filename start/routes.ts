/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/


//arquivo principal de rotas

import Route from '@ioc:Adonis/Core/Route'

//Criação de um grupo para um prefixo único
Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })
  
  //Criamos uma rota e chamamos uma controle que chama a função store
  // Route.post('/moments', 'MomentsController.store')

  /*
    Criação de uma rota usando resource, ele cria as principais rotas para uso da controller, 
    já usando o apiOnly, como nao estamos trabalhando com uma view, ele deixa só as rotas disponíveis
    para uso em api  
  */
  Route.resource('/moments', 'MomentsController').apiOnly()
  
  Route.get('/comments', 'CommentsController.index')
  Route.post('/moments/:momentId/comments', 'CommentsController.store')
  Route.delete('/comments/:id', 'CommentsController.destroy')
  Route.patch('/comments/:id', 'CommentsController.update')

}).prefix('/api')