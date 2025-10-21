# Prompts usados (exemplo)

Exemplo de prompt para usePolling hook.


## Criação do `product.repository.ts`
Para utilizar uma arquitetura de tres camadas e manter a apliação limpa, separei o acesso ao banco do serviço de produto em um repositório, fiz isso com o prompt 

> Considering a three layer architecture, separate the db access functions into a repository using nest dependency injection #file:product  #file:product.service.ts 

O copilot conseguiu separar corretamente as dependências e atualizar o service, mantendo o mesmo comportamento anterior


## Atualizações no `user.service.ts`
> add validations to see if the user exists before updating and deleting, also check if a user with the same email already exists before creating a new one. Return the correct http errors


## Começar o authentication module

> start the authentication module. It should follow the same pattern as the user and product modules, but with two routes: /sign-in and /sign-up. The authentication module shoult import the user service and use it for all the CRUD operations needed for authentication

Seguido de

> instead of returning the user from the auth service, it should use the nest JWT service to sign a token with the user information in it. Refactor the code to use the JWT

## Upload de images
> I need to handle images uploads for the products entity in the backend, thinking about a clean and organized project structure, how should I handle this feature? I thought about creating a ImageService/ImageRepository, and use a S3 compatible backend to make it more robust, what do you think?

>Yes, create the storage module. Install the necessary dependencies for it and update the docker-compose file in the root of the project to add a object storage. Don't update the produts module just yet.

Depois disso foi necessário brigar com o copilot por um tempo, pois ele não seguiu os padões do projeto, acessou varáiveis diretamente do process.env, etc.

> Now, I need to implement the image upload to the products routes. The create product method should be able to optionally receive an image when creating. The product entity should have an imageUrl column in the database, which should then be used to access the image from the browser. Make both of these changes to the product