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