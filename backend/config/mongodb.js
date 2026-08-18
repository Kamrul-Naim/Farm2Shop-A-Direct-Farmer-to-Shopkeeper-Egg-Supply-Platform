import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log("Database Connected"))
    mongoose.connection.on('error', (err) => console.log("Database Connection Error:", err))

    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not defined in environment variables");
        return;
    }

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/farm2shop`)
    } catch (error) {
        console.error("Initial MongoDB connection error:", error);
    }

}

export default connectDB;