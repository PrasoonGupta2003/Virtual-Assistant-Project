import mongoose from "mongoose";
// const uri=process.env.MONGODB_URL;
const connectDb=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected");
    }catch(err){
        console.log(err);
    }
}
export default connectDb;
