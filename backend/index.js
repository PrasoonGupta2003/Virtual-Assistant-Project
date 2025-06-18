import express from "express";
import dotenv from "dotenv";
dotenv.config(); 

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";
import historyRoutes from './routes/historyRoutes.js';

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

const app = express();
const port=3000;
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use('/api/history', historyRoutes);


app.listen(port, () => {
    connectDB();
    console.log(`App listening to ${port}`);
})