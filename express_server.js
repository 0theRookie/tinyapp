const express = require('express');//requiring express
const app = express();
const PORT = 8080;//setting port to listen on
const bodyParser = require('body-parser');


// set the view engine to ejs
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}
//use random string function

function generateRandomString() {
  let stringKey = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for (var i = 0; i < 6; i++){
    stringKey += possible.charAt(Math.floor(Math.random() * possible.length));
  }
 
  return stringKey;
 }

//GET request + handler --> gets request
// for root, renders response as index page
app.get("/", (req, res) => {
  res.send("Hi! This works!");
})

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.post("/urls", (req, res) => {
  let shortened = generateRandomString();
  console.log(req.body.longURL);  // debug statement to see POST parameters
  //call random string func
  urlDatabase[shortened] = req.body.longURL;
  console.log(shortened);
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
  console.log(urlDatabase);
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id]
  };
  console.log(templateVars);
  res.render("pages/urls_show", templateVars);
})


//Server listener - waits for request and responds
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

