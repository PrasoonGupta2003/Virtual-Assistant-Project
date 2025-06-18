import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    assistantName:{
        type: String,
    },
    assistantImage:{
        type: String,
    },
    history: [
  {
    input: { type: String },
    output: { type: String },
    details: { type: String },
    link: { type: String },
    timestamp: { type: Date, default: Date.now }
  }
]
});
const User= mongoose.model("User",userSchema);
export default User;