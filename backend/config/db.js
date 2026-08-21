import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected successfully`);
  } catch (err) {
    console.error(`Error: ${err}`);

    process.exit(1);
  }
};

export default connectDB;
