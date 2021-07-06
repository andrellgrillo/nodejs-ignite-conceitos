const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers
  const user = users.find((user) => user.username === username);
  if (!user){
    return response.status(404).json({ error: "User not found!"})
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const userExist = users.some(user => user.username === username);
  
  if(userExist) {
    return response.status(400).json({ error: "User already exist!"})
  }
  
  const id = uuidv4();
  const user = {
    id,
    name,
    username,
    todos:[]
  }
  users.push(user)
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  const id = uuidv4();
  const addTodo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(addTodo)
  return response.status(201).json(addTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if(!todo) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
  
  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if(!todo) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }

  todo.done = true;
  
  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if(!todo) {
    return response.status(404).json({error: 'Mensagem de erro'})
  }
  
  user.todos.splice(todo, 1)
  
  return response.status(204).send();
});

module.exports = app;