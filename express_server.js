const express = require('express');
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');

const app = express();
const bodyParser = require('body-parser');

const PORT = 8080;

const USER_COOKIE_NAME = 'userId';

app.set("view engine", "ejs");

app.use(cookieSession({
  keys: ['secret'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser.urlencoded({extended: true}));


const users = {};

const urlDatabase = {};

function findUserByEmailAndPassword(email, pass){
  for(const userId in users){
    const user = users[userId];
    if(user.email === email  && bcrypt.compareSync(pass, user.password)){
      return user;
    }
  }
};

function urlsForUser(id){
  let userSpecificDb = {};

  for(let key in urlDatabase){
    if(urlDatabase[key].userId === id){
      userSpecificDb[key] = urlDatabase[key];
    }
  }
  return userSpecificDb;
};

function generateRandomString() {
  let stringKey = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for (var i = 0; i < 6; i++){
    stringKey += possible.charAt(Math.floor(Math.random() * possible.length));
  }
 
  return stringKey;
 }


app.get("/", (req, res) => { 
  if(req.session){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// |--------- /urls ---------|

app.get( "/urls", (req, res) => { 
  let userId = req.session.userId;

  if(userId){
    console.log("Cookie found!", userId);
  }

  let templateVars = { 
    urls: urlsForUser(userId),
    user: users[userId]
  };

  res.render("pages/urls_index", templateVars);

});
app.post("/urls", (req, res) => {

  let shortened = generateRandomString();

 
  var testURL = {
    longURL: req.body.longURL,
    shortURL: shortened,
    userId: req.session.userId
  }

  urlDatabase[shortened] = testURL;
  let newURL = `http://localhost:8080/urls/${shortened}`;
  res.redirect(newURL);     
});


app.get("/urls/new", (req, res) => {

  if(!req.session['userId']){
    res.redirect("/login");
  }
  let userId = req.session.userId;

  const templateVars = {
    user: users[userId],
  }
  res.render("pages/urls_new", templateVars);
});

//|--------- /urls/:id ---------|

app.post("/urls/:id/edit", (req, res) => {
 
  let shortUrl = req.params.id;
  urlDatabase[shortUrl].longURL = req.body.longURL;

  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req, res) => {
  const paramsId = req.params.id;
  for(let key in urlDatabase){

    if(urlDatabase[paramsId]){

      if(urlDatabase[paramsId].userId === req.session.userId){
        delete urlDatabase[paramsId];
      }
    }
  }
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {

  const paramsId = req.params.id;
  const longURL = urlDatabase[paramsId].longURL

  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => { 

  const paramsId = req.params.id;

  let templateVars = { 
    shortURL: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.session.userId]
  }

  if(urlDatabase[paramsId]){
    if(urlDatabase[paramsId].userId === req.session.userId){
      res.render("pages/urls_show", templateVars);
    }
  }
  res.redirect("/urls");
});


//|--------- /login - /logout - /register ---------|

app.get("/register", (req, res) => {
  res.render("pages/register");
});
app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 12);

  const id = generateRandomString();

  if(!email || !password){
    res.status(400).send("Error 400: Please fill out both fields.");  

  } else {
    for(let userId in users){
      if(users[userId].email === email){
        res.status(400).send("Error 400: Email not valid!");
      }
    }

    users[id] = {
      id,
      email,
      password: hashedPassword
    };

    console.log(`${id} registered ${email}`);
    req.session.userId = id;
    res.redirect("/urls");
  }
});




app.get("/login", (req, res) => {
  res.render("pages/login");
});
app.post("/login", (req, res) => {
  
  const bodyEmail = req.body["email"];
  const bodyPassword = req.body["password"];
  
  const user = findUserByEmailAndPassword(bodyEmail, bodyPassword);
  
  if(user === undefined){
    res.redirect('/login');

  } else {
    req.session.userId = user.id;
    res.redirect('/urls');
  }
});




app.post("/logout", (req, res) => {
  req.session = null;

  res.redirect("/");
});


//Server listener 
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
});

