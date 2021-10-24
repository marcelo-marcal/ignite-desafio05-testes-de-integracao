# ignite-desafio05-testes-de-integracao
## Desafio 02 - Testes de integração

Sobre o desafio

Nesse desafio, foi criado um testes de integração para a mesma aplicação usada no desafio anterior.

Instalação:


### Criar arquivos no statement:
src/modules/statements/useCases/createStatement/CreateStatementController.spec.ts

src/modules/statements/useCases/getBalance/GetBalanceController.spec.ts

src/modules/statements/useCases/getStatementOperation/GetStatementOperationController.spec.ts


### Criar arquivos no users:

src/modules/users/useCases/authenticateUser/AuthenticateUserController.spec.ts

src/modules/users/useCases/createUser/CreateUserController.spec.ts

src/modules/users/useCases/showUserProfile/ShowUserProfileController.spec.ts

### Criar o banco de dados de teste no Beekeeper:

### Rodar

1 - docker-compose up -d

2 - yarn typeorm migration:run

3 - yarn test


<h1 align="center">
    <img src="./img/img007.png" />
</h1>


## Rotas da aplicação

Para te ajudar a entender melhor o funcionamento da aplicação como um todo, abaixo você verá uma descrição de cada rota e quais parâmetros recebe.

### POST `/api/v1/users`

A rota recebe `name`, `email` e `password` dentro do corpo da requisição, salva o usuário criado no banco e retorna uma resposta vazia com status `201`.

### POST `/api/v1/sessions`

A rota recebe `email` e `password` no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.

Essa aplicação não possui refresh token, ou seja, o token criado dura apenas 1 dia e deve ser recriado após o período mencionado.

### GET `/api/v1/profile`

A rota recebe um token JWT pelo header da requisição e retorna as informações do usuário autenticado.

### GET `/api/v1/statements/balance`

A rota recebe um token JWT pelo header da requisição e retorna uma lista com todas as operações de depósito e saque do usuário autenticado e também o saldo total numa propriedade `balance`.

### POST `/api/v1/statements/deposit`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de depósito do valor e retorna as informações do depósito criado com status `201`.

### POST `/api/v1/statements/withdraw`

A rota recebe um token JWT pelo header e `amount` e `description` no corpo da requisição, registra a operação de saque do valor (caso o usuário possua saldo válido) e retorna as informações do saque criado com status `201`.

### GET `/api/v1/statements/:statement_id`

A rota recebe um token JWT pelo header e o id de uma operação registrada (saque ou depósito) na URL da rota e retorna as informações da operação encontrada.



https://www.notion.so/Desafio-02-Testes-de-integra-o-70a8af48044d444cb1d2c1fa00056958
