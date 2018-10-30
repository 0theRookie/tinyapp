const express = require('express');//requiring express
const app = express();
const PORT = 8080;//setting port to listen on

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

//GET request handler - takes in request and responds with anonymous cb func
app.get("/", (request, response) => {
  response.send("Hello traveller!")
})
app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
})
//gets request to /hello path and responds with cb func, sending html that
// will be rendered in the browser
app.get("/hello", (request, response) => {
  response.send("<html><body> Hello<b>World</b></body></html>\n")
})

//Server listener - waits for request and responds
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

