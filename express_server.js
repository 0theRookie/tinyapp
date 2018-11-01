const express = require('express');//requiring express
const cookieParser = require('cookie-parser');

const app = express();
const bodyParser = require('body-parser');

const PORT = 8080;//setting port to listen on

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(cookieParser());
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

// |--------- /urls ---------|
app.get( "/urls", (req, res) => { 

  if(req.cookies){

    console.log("Cookies are there");
    console.log(req.cookies["username"]);
  } else{
    console.log("Cookies are not there")
  }
  let templateVars = { urls: urlDatabase, username: req.cookies.username};
  res.render("pages/urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();//shortened url string
  urlDatabase[shortened] = req.body.longURL;
  let longURL = `http://localhost:8080/urls/${shortened}`;
  res.redirect(longURL);        //redirects to give short url
  console.log(urlDatabase);
});


app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
})

//|--------- /urls/:id ---------|

app.post("/urls/:id/edit", (req, res) => {
  // 1. what is :id (ie: shorturl)
  // 2. need to take that :id/shorturl and find it in db
  // 3. change the value of that shorturl in db to the new longurl
 
  let shortUrl = req.params.id;

  urlDatabase[shortUrl] = req.body.longURL;
  
  res.redirect("/urls");
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


//|--------- /login ---------|


app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
})

//Server listener 
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

