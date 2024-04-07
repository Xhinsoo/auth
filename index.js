const express = require("express");
const app = express();
const User = require("./model/user"); //caps U since its a class/document

//set view engine to ejs
app.set("view engine", "ejs");
app.set("views","views")

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secret", (req, res) => {
  res.send("this is secret, can only be seen when logged in");
});

app.listen(3000, (req, res) => {
  console.log("serving your app");
});
