const express = require('express');//requiring express
const cookieParser = require('cookie-parser');

const app = express();
const bodyParser = require('body-parser');


const PORT = 8080;//setting port to listen on
const USER_COOKIE_NAME = 'userId';

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
  "b2xVn2": {
   longURL: "http://www.lighthouselabs.ca",
   shortURL: "b2xVn2",
   userId: "Bert"
  },
 
 
 
  "9sm5xK": {
    longURL: "http://www.google.com",
    shortURL:  "9sm5xK",
    userId: "Ernie"
  }
}

function findUserByEmailAndPassword(email, password){
  for(const userId in users){
    const user = users[userId];
    if(user.email === email  && user.password === password){
      return user;
    }
  }
}

function urlsForUser(id){
  let userSpecificDb = {};
  // const paramsId = req.params.id;


  for(let key in urlDatabase){
    if(urlDatabase[key].userId === id){
      userSpecificDb[key] = urlDatabase[key];
    }
  }
  return userSpecificDb;
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
  let userId = req.cookies[USER_COOKIE_NAME];

  if(userId){
    console.log("Cookie found!", userId);
  }
  

  let templateVars = { 
    urls: urlsForUser(userId),
    user: userId
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

  console.log('Cookies', req.cookies);
  if(!req.cookies['userId']){
    res.redirect("/login");
  }

  const templateVars = {
    user: users[req.cookies[USER_COOKIE_NAME]],
  }
  res.render("pages/urls_new", templateVars);
})

//|--------- /urls/:id ---------|

app.post("/urls/:id/edit", (req, res) => {
  // 1. what is :id (ie: shorturl)
  // 2. need to take that :id/shorturl and find it in db
  // 3. change the value of that shorturl in db to the new longurl
  console.log("urlDatabase[paramsId]", urlDatabase[paramsId])
  console.log("req.cookies", req.cookies)

    let shortUrl = req.params.id;

  
  // for(let key in urlDatabase){
  //   if(urlDatabase[key] )
  // }
  urlDatabase[shortUrl] = req.body.longURL;
  
  res.redirect("/urls");
})

//deletes a URL entry from database
app.post("/urls/:id/delete", (req, res) => {
  const paramsId = req.params.id;
  for(let key in urlDatabase){

    if(urlDatabase[paramsId]){

      if(urlDatabase[paramsId].userId === req.cookies.userId){
        delete urlDatabase[paramsId];

      }
    }
      
  // console.log("req.params.id", req.params.id)
  // console.log("urlDatabase[paramsId].longURL", urlDatabase[paramsId].longURL)
  // console.log("urlDatabase[key] ",urlDatabase[key])
  }
  
  // for(let key in urlDatabase){
  //   if(urlDatabase[key])
  // }
  res.redirect("/urls");
})

app.get("/u/:id", (req, res) => {

  const paramsId = req.params.id;
  const longURL = urlDatabase[paramsId].longURL

  res.redirect(longURL);
})


app.get("/urls/:id", (req, res) => {//renders new shortened url from (pages/urls_new)
  const paramsId = req.params.id;

  let templateVars = { 
    shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies[USER_COOKIE_NAME]]
  }

  // console.log("urlDatabase[paramsId]", urlDatabase[paramsId])
  // console.log("req.cookies", req.cookies)

  if(urlDatabase[paramsId]){
    if(urlDatabase[paramsId].userId === req.cookies.userId){
      res.render("pages/urls_show", templateVars);
    }
  }
  res.redirect("/urls");
})


//|--------- /login - /logout - /register ---------|

app.get("/register", (req, res) => {
  res.render("pages/register");
})
app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();

  console.log(users["id"]);

  if(!email || !password){


    res.status(400).send("Error 400: Please fill out both fields.")
    
  } else {
    
    for(let userId in users){

      if(users[userId].email === email){

        res.status(400).send("Error 400: Email not valid!");

      }
    }

    users[id] = {};

    users[id].id = id;
    users[id].email = email;
    users[id].password = password;

    console.log(`${id} registered ${email}`);

  
    res.cookie(USER_COOKIE_NAME, id);
  
  
    res.redirect("/urls");
  }
  
})




app.get("/login", (req, res) => {
  res.render("pages/login");
});



app.post("/login", (req, res) => {
  const bodyEmail = req.body["email"];
  const bodyPassword = req.body["password"];
  console.log()
  // console.log(users.Bert);
  // console.log("req.cookies: ", req.cookies);
  const user = findUserByEmailAndPassword(bodyEmail, bodyPassword);
  if(user === undefined){
    res.redirect('/login');
  } else {
    
    res.cookie(USER_COOKIE_NAME, user.id);
    res.redirect('/urls');
  }
})




app.post("/logout", (req, res) => {
  let userId = req.cookies[USER_COOKIE_NAME];
  res.clearCookie(USER_COOKIE_NAME);
  res.redirect("/");
})


//Server listener 
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

