import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
       name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      isAdmin: {
        type: Boolean,
        default: false
      }
}, {
    timestamps:true
})

// Hash password before saving
userSchema.pre("save", async function(next) {
  
  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


})

// Compare password method
userSchema.methods.matchPassword = async function (enterPassword) {
  
  return await bcrypt.compare(enterPassword, this.password);

}

const User = mongoose.model("User", userSchema);

export default User;