const express = require('express');//requiring express
const app = express();
const PORT = 8080;//setting port to listen on

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (request, response) => {
  response.send("Hello traveller!")
})

