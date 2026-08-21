import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "DONE"],
      default: "PENDING",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    dueDate: { type: Date },
    location: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
