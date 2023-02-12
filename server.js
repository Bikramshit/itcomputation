import app from "./app.js";
import { connectDB } from "./config/database.js";
import mongoose from "mongoose";

mongoose.set('strictQuery', false);


connectDB();


app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
