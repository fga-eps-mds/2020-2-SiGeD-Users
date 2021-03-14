# API de Usuários
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL3-blue.svg)](https://opensource.org/licenses/gpl-3.0.html)

Essa API faz parte da arquitetura de microsserviços do projeto [`NomeDoProjeto`](https://github.com/fga-eps-mds/2020-2-G4), sua funcionalidade é possibilitar o controle dos dados dos usuários. 

## Como contribuir?

Gostaria de contribuir com nosso projeto? Acesse o nosso [guia de contribuição](https://fga-eps-mds.github.io/2020-2-G4/CONTRIBUTING/) onde são explicados todos os passos.
Caso reste duvidas você também pode entrar em contato conosco criando uma issue.

## Documentação

A documentação do projeto pode ser acessada pelo nosso site em https://fga-eps-mds.github.io/2020-2-G4/ ou você pode acessar pela [NomeDoProjeto Documentação](https://fga-eps-mds.github.io/2020-2-G4/home/)

## Como rodar?

Para rodar a API é preciso usar o seguinte comando usando o docker.

```bash
docker-compose up
```
A API estará rodando na [porta 3001](http://localhost:3001).

## Rotas

**GET: `/users/`**

Para receber os dados dos usuários.


**POST: `/signup/`**

Para criar um novo usuário, envie os dados nesse formato:

```json
{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "role": "Cargo",
    "sector": "Area de Atuação",
    "pass": "Senha"
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

**DELETE: `/users/delete/:id`**

Para desativar um cliente pelo `id`.
