/* 
    - Query params => meusite.com/users?name=joelson&age=38    //FILTROS
    - Route params => /users/2     // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => {"name":"Joelson", "age":}

    --GET............=> Buscar informação no Back-end
    --POST...........=> Criar informação no Back-end
    --PUT............=> Alterar/ Atualizar informação no Back-end
    --DELETE.........=> Deletar informação no Back-end

    --Middleware => INTERCEPATADOR => Tem o peoder de parar ou alterar dados da requisição
*/

const express = require("express");
const uuid = require("uuid");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(bodyParser.json());

// varialvel para armazenar os usuarios no array
const users = [];
//--Middleware => INTERCEPATADOR => Tem o peoder de parar ou alterar dados da requisição

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ error: "User not found" });
  }

  request.userIndex = index;
  request.userId = id;

  next();
};

//--GET............=> Buscar informação no Back-end
app.get("/users", (request, response) => {
  return response.json(users);
});

//--POST...........=> Criar informação no Back-end
app.post("/users", (request, response) => {
  const { name, age } = request.body;
  const user = { id: uuid.v4(), name, age };
  users.push(user);
  return response.status(201).json(users);
});

//--PUT............=> Alterar/ Atualizar informação no Back-end
// pra atualizar um usuario precisamos pegar um id para saber qual o usuario vai atualizar
app.put("/users/:id", checkUserId, (request, response) => {
  const { name, age } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updatedUser = { id, name, age };

  users[index] = updatedUser;
  return response.json(updatedUser);
});
//--DELETE.........=> Deletar informação no Back-end
// pra deletar um usuario precisamos pegar um id para saber qual o usuario vai atualizar
app.delete("/users/:id", checkUserId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json();
});

// avisando em qual porta
app.listen(port, () => {
  console.log(`😎 Server started on port ${port}`);
});
