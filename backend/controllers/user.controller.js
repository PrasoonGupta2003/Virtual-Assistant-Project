import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import moment from "moment/moment.js";
import geminiResponse from "../gemini.js";

export const getCurrentUser=async(req,res)=>{
try{
    const userId=req.userId;
    const user=await User.findById(userId).select("-password");
    if(!user){
        return res.status(400).json({message:"User not found"});
    }
    return res.status(200).json(user);
}
catch(e){
    return res.status(400).json({message:"Get current user error!"});
}
}

export const updateAssistant = async (req,res)=>{
    try{
        const {assistantName, imageUrl}=req.body;
        let assistantImage;
        if(req.file){
            assistantImage= await uploadOnCloudinary(req.file.path);
        }
        else{
            assistantImage=imageUrl;
        }
        const user=await User.findByIdAndUpdate(req.userId,{
            assistantName,assistantImage
        },{new:true}).select("-password");
        console.log(user);
        return res.status(200).json(user)
    }
    catch (e){
        console.log(e);
            return res.status(400).json({message:"Update assistant error!"});
    }
}

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);
    const resultText = typeof result === "string" ? result : JSON.stringify(result);

    // Clean the response to get the actual JSON
    const cleanedText = resultText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanedText.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res.status(400).json({ message: "Invalid response from assistant." });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    // Built-in date/time/day/month responses
    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });

      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });

      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        });

      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`
        });

      default:
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response || "Sorry, I couldn't process that.",
          details: gemResult.details || null,
          link: gemResult.link || null
        });
    }
  } catch (error) {
    console.error("Assistant Error:", error);
    return res.status(500).json({ message: "Failed to process request." });
  }
};
