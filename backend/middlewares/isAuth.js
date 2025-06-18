import jwt from "jsonwebtoken";

const isAuth=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(400).json({message:"token not found"});
        }
        const verifyToken=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=verifyToken.userId;
        next();
    }
    catch(err){
        return res.status(500).json({message:"Authentication Error!"});
    }
}
export default isAuth;