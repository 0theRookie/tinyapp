const express = require('express');//requiring express
const app = express();
const PORT = 8080;//setting port to listen on

// set the view engine to ejs
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

//GET request + handler --> gets request
// for root, renders response as index page
app.get("/", (req, res) => {
  res.send("Hi! This works!");
})


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
})

app.git("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id }
})


//Server listener - waits for request and responds
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

