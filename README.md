# API de Usuários
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL3-blue.svg)](https://opensource.org/licenses/gpl-3.0.html)
[![codecov](https://codecov.io/gh/fga-eps-mds/2020-2-SiGeD-Users/branch/master/graph/badge.svg?token=O4AN6AODE8)](https://codecov.io/gh/fga-eps-mds/2020-2-SiGeD-Users)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2020-2-G4-Users&metric=alert_status)](https://sonarcloud.io/dashboard?id=fga-eps-mds_2020-2-G4-Users)
[![Maintainability](https://api.codeclimate.com/v1/badges/c2a2458a109e6aeec08d/maintainability)](https://codeclimate.com/github/fga-eps-mds/2020-2-SiGeD-Users/maintainability)

Essa API faz parte da arquitetura de microsserviços do projeto [`SiGeD`](https://github.com/fga-eps-mds/2020-2-SiGeD), sua funcionalidade é possibilitar o controle dos dados dos usuários. 

## Como contribuir?

Gostaria de contribuir com nosso projeto? Acesse o nosso [guia de contribuição](https://fga-eps-mds.github.io/2020-2-SiGeD/CONTRIBUTING/) onde são explicados todos os passos.
Caso reste duvidas você também pode entrar em contato conosco criando uma issue.

## Documentação

A documentação do projeto pode ser acessada pelo nosso site em https://fga-eps-mds.github.io/2020-2-SiGeD/ ou você pode acessar pela [SiGeD Documentação](https://fga-eps-mds.github.io/2020-2-SiGeD/home/)

## Testes

Todas as funções adicionadas nessa API devem ser testadas, o repositŕorio aceita até 10% do total de lihas não testadas. Para rodar os testes nesse repositŕio deve ser executado o comando:

```bash
docker-compose run api_users bash -c  "yarn && yarn jest --coverage --forceExit"
```

## Como rodar?

É necessário adicionar os seguintes parâmetros para o arquivo .env:

```
host=smtp.gmail.com
port=
email=sigedemandas@gmail.com
pass=siged2021
```

 O email que será utilizado para enviar senhas temporárias deve ser colocado no campo de "email" juntamente com a senha deste no campo "pass". No campo "host" se adiciona o protocolo de comunicação do email, quando necessário.

Para rodar a API é preciso usar os seguintes comandos usando o docker:

Crie uma network para os containers da API, caso não exista:

```bash
docker network create siged_backend
```

Suba o container com o comando:

```bash
docker-compose up
```
A API estará rodando na [porta 3001](http://localhost:3001).

## Rotas

**GET: `/users/`**

Para receber os dados dos usuários.

**GET: `/users/:id`**

Para receber os dados de um usuário específico pelo `id`.

**GET: `/users/newest-four`**

Para receber os dados dos últimos quatro usuários adicionados.


**POST: `/signup/`**

Para criar um novo usuário, envie os dados nesse formato:

```json
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "Cargo",
    "sector": "Area de Atuação",
}
```

**POST: `/login/`**

Para entrar no sitema, envie os dados nesse formato:

```json
{
    "email": "usuario@email.com",
    "pass": "Senha"
}
```

**POST: `/recover-password`**

para recuperar a senha de um usuário:

```json
{
    "email": "usuario@email.com",
}
```

**PUT: `/users/update/:id`**

Para atualizar os dados do usuário, envie os dados atualizados seguindo o padrão:

```json
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "Cargo",
    "sector": "Area de Atuação",
    "pass": "Senha"
}
```

**PUT: `/change-password/:id`**

Para alterar a senha de um usuário pelo `id`:

```json
{
    "pass": "Nova Senha"
}
```

**DELETE: `/users/delete/:id`**

Para desativar um cliente pelo `id`.
