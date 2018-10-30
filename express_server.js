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
  res.render("pages/index");
})


// app.get("/urls.json", (request, response) => {
//   response.json(urlDatabase);
// })


app.get("/about", (req, res) => {
  res.render("pages/about");
})


//gets request to /hello path and responds with cb func, sending html that
// will be rendered in the browser -->


// app.get("/hello", (request, response) => {
//   response.send("<html><body> Hello<b>World</b></body></html>\n")
// })

//Server listener - waits for request and responds
app.listen(PORT, () => {
  console.log(`App listening on port : ${PORT}!`)
})

