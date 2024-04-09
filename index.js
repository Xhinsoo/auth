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

//middleware that checks for login
const requireLogin = (req,res,next)=>{
  if (!req.session.user_id){
    return res.redirect("/login")
  }
  next();
}

app.get("/", (req, res) => {
  res.send("homepage");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // const hash = await bcrypt.hash(password, 12); //hashing pw first
  //saving new user and hashed to DB
  const user = new User({
    username,
    password,
  });
  await user.save();
  req.session.user_id = user._id;
  console.log(req.session);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username,password);
  if(foundUser){
    req.session.user_id = foundUser._id;
    res.redirect("/secret");
  }else {
    res.send("try again");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null; //set user id to null
  // req.session.destroy() //destroys the entire session
  res.redirect("/login");
});
app.get("/secret", requireLogin, (req, res) => {
  res.render("secret");
});


app.get("/topsecret", requireLogin, (req,res)=>{
  res.send("top secret!!")
})
app.listen(3000, (req, res) => {
  console.log("serving your app");
});
