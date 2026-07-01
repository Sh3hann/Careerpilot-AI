import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IInterview extends Document {
  userId: Types.ObjectId;
  role: string;
  difficulty: "easy" | "medium" | "hard";
  conversation: Array<{
    role: "assistant" | "user";
    content: string;
    timestamp: Date;
    score?: number;
    feedback?: string;
  }>;
  status: "in-progress" | "completed";
  overallScore?: number;
  report?: {
    summary: string;
    strengths: string[];
    improvements: string[];
    recommendations: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    conversation: [
      {
        role: { type: String, enum: ["assistant", "user"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        score: Number,
        feedback: String,
      },
    ],
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    overallScore: Number,
    report: {
      summary: String,
      strengths: [String],
      improvements: [String],
      recommendations: String,
    },
  },
  { timestamps: true }
);

const Interview: Model<IInterview> =
  mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", InterviewSchema);

export default Interview;
