import express from "express";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";


config({
    path:"./config/config.env",
})
const app = express();




app.use(express.json());
app.use(
    express.urlencoded({
        extended:true,
    })
)

app.use(cookieParser());

// Importing & Using Routes 
import user from "./routes/userRoutes.js"
app.use("/api", user);
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials:true,
methods: ["GET", "POST", "DELETE", "PUT"],
}))
export default app;


app.get("/", (req, res) => {
    res.send(`<h1>Server is working. <a href=${process.env.FRONTEND_URL}>Click here </a> to visit frontend</h1>`);
})







import ErrorMiddleware from "./middlewares/Error.js"

app.use(ErrorMiddleware)