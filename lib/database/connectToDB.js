import mongoose from "mongoose";

export const connectToDB = async () => {
    console.log("\x1b[32mConnecting to MongoDB\x1b[0m");
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("\x1b[32mConnected to MongoDB\x1b[0m");
        return true;
    } catch (error) {
        console.log("\x1b[33mError in connecting to MongoDB\x1b[0m");
        throw new Error(error || "Error in connecting to MongoDB");
    }
}