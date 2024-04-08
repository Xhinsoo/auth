const express = require("express");
const app = express();
const User = require("./model/user"); //caps U since its a class/document
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

mongoose
  .connect("mongodb://127.0.0.1:27017/authe")
  .then(() => {
    console.log("connection open");
  })
  .catch((e) => {
    console.log("error is:", e);
  });

//set view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "thisissecret" }));

app.get("/", (req, res) => {
  res.send("homepage");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  //saving new user and hashed to DB
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  req.session.user_id = user._id;

  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    req.session.user_id = user._id;
    res.render("secret");
  } else {
    res.send("try again");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null; //set user id to null
  // req.session.destroy() //destroys the entire session
  res.redirect("/login");
});
app.get("/secret", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.render("secret");
});

app.listen(3000, (req, res) => {
  console.log("serving your app");
});
