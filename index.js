const express = require("express");
const app = express();
const User = require("./model/user"); //caps U since its a class/document
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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
app.set("views","views")

app.use(express.urlencoded({extended:true}))


app.get("/", (req, res) => {
  res.send("homepage");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register",async(req,res)=>{
    const {username, password } = req.body;
    const hash= await bcrypt.hash(password,12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    res.redirect("/")
})
app.get("/secret", (req, res) => {
  res.send("this is secret, can only be seen when logged in");
});

app.listen(3000, (req, res) => {
  console.log("serving your app");
});
