import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
  } catch (e) {
    console.log("JWT Token Error:", e);
    return null; 
  }
};

export default genToken;
