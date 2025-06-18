import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter=express.Router();
userRouter.get("/current",isAuth,getCurrentUser,(req, res) => {
  res.status(200).json(req.user);
});
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant,(req, res) => {
  res.status(200).json(req.user);
});
userRouter.post("/asktoassistant",isAuth,askToAssistant);
export default userRouter;