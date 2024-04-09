const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username cannot be blank"],
  },

  password: {
    type: String,
    required: [true, "Password cannot be blank"],
  },
});
//in userSchema we can access .statics where we can define multiple methods to add to user class not its instances

userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);
  //if  isValid is true return foundUser object, or else false
  return isValid ? foundUser : false;
};

userSchema.pre("save", async function (next) {
  // only hash pw if its has been modified
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
module.exports = mongoose.model("User", userSchema);
