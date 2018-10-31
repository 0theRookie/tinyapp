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
  res.redirect("/urls");
})


app.get( "/urls", (req, res) => { 
  let templateVars = { urls: urlDatabase};
  res.render("pages/urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();//shortened url string
  //call random string func
  urlDatabase[shortened] = req.body.longURL;
  let longURL = `http://localhost:8080/urls/${shortened}`;
  res.redirect(longURL);        //redirects to give short url
  console.log(urlDatabase);
});


app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
})


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
})



app.get("/urls/:id", (req, res) => {//renders new shortened url from (pages/urls_new)
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

