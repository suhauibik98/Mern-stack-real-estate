const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")

 
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: [5, "name must be 5 charecter"],
      required: true,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      min: [8, "pass must be 8 char"],
      max: [16, "max pass is 16 char"],
      required: true,
      select : false
    },
    avatar:{
      type:String,
      default:"https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"
    }
  },
  { timestamps: true }
);


userSchema.pre("save" , async function(next){
 if(this.isModified("password")){
  this.password = await bcrypt.hash(this.password, 10);
  
 }
 else{next()}


})




userSchema.methods.comparePassword = async function(password , savedPassword){
  const isPasswordMatched = await bcrypt.compare(password , savedPassword)
  return isPasswordMatched
}

const User = mongoose.model("users", userSchema);
module.exports = User;
// https://www.youtube.com/watch?v=VAaUy_Moivw&t=3308s