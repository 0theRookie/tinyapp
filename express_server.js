const express = require('express');//requiring express
const cookieParser = require('cookie-parser');

const app = express();
const bodyParser = require('body-parser');


const PORT = 8080;//setting port to listen on

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


const users = {
  "Bert": {
    id: "Bert",
    email: "bert@bert.com",
    password: "bert"
  },
  "Ernie": {
    id: "Ernie",
    email: "a@gmail.com",
    password: "bert"
  }
}

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
  if(req.cookies){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
})

// |--------- /urls ---------|
app.get( "/urls", (req, res) => { 

  if(req.cookies){

    console.log("Cookie found!");
    // console.log(req.cookies.username);
  }
  // console.log("============");
  // console.log(users[req.cookies.userId]);
  // console.log("============");


  let templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies["id"]]
  };
  res.render("pages/urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();//shortened url string
  urlDatabase[shortened] = req.body.longURL;
  let longURL = `http://localhost:8080/urls/${shortened}`;
  res.redirect(longURL);        //redirects to give short url
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["id"]],
  }
  res.render("pages/urls_new", templateVars);
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

//deletes a URL entry from database
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
})



app.get("/urls/:id", (req, res) => {//renders new shortened url from (pages/urls_new)
  let templateVars = { 
    shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["id"]]
  }
  res.render("pages/urls_show", templateVars);
})


//|--------- /login - /logout - /register ---------|

app.get("/register", (req, res) => {
  res.render("pages/register");
})
app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();

  if(!email || !password){
    console.log("Missing field!")
    throw new Error("400: Please fill out both fields");
  } else {

    const newUser = {
      "id": id,
      "email": email,
      "password": password
    }
    for(let userId in users){
      if(users[userId].email === email){
        throw new Error("400: Email already exists!");
      } else {
        console.log("Checked");
      }
    }
    users[id] = newUser;
  
    res.cookie("id", id);
  
  
    res.redirect("/urls");
  }
  
})




app.get("/login", (req, res) => {
  res.render("pages/login");
})
app.post("/login", (req, res) => {
  const userId = req.cookies["id"];


  for(let userId in users){
    // console.log('req.body.email' + );
    // console.log(users.userId);
    // console.log();

    if(users[userId].email !== req.body["email"]){
      throw new Error("403: Email not in system");
    } else if(users[userId].password !== req.body["password"]){
      throw new Error("403: Nope.");
    }else {
      res.cookie("userId", userId);
      res.redirect("/urls");
    }
  }
})




app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})


//Server listener 
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

