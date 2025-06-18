import genToken from "../config/token.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp= async(req, res)=>{
try{
    const {name,email,password} = req.body;
    const userExist=await User.findOne({email});
    if(userExist){
        return res.status(400).json({message:"User with Email provided already exists!"});
    }
    if(password.length < 6){
        return res.status(400).json({message:"Password must be of atleast six characters!"});
    }
    const hashedPassword= await bcrypt.hash(password,10);
    const user =await User.create({
        name:name,
        email:email,
        password:hashedPassword,
    });

    const token=genToken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+10*24*60*60*1000),
        maxAge:10*24*60*60*1000,
    })

    return res.status(201).json(user);
}catch(e){
console.log(e);
return res.status(500).json({message:"Signup error"});
}
};

export const login= async(req, res)=>{
try{
    const {email,password} = req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User with Email provided does not exist!"});
    }
    const passwordExist=await bcrypt.compare(password,user.password);

    if(!passwordExist){
        return res.status(400).json({message: "Wrong Password"});
    }
    
    const token=genToken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        sameSite: "Strict",
        expires:new Date(Date.now()+10*24*60*60*1000),
        maxAge:10*24*60*60*1000,
    })

    return res.status(200).json(user);
}catch(e){
console.log(e);
return res.status(500).json({message:"Login error!"});
}
};

export const logout= async(req, res)=>{
try{
    res.clearCookie("token");
    return res.status(200).json({message:"Logout successful!"})
}catch(e){
console.log(e);
return res.status(500).json({message:"Logout error!"});
}
};
