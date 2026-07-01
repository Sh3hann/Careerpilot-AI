import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICV extends Document {
  userId: Types.ObjectId;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    title: string;
    summary?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    achievements?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location?: string;
    responsibilities: string;
    aiResponsibilities?: string;
  }>;
  skills: {
    technical: string[];
    soft?: string[];
    languages?: string[];
    tools?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  version: "ats" | "creative";
  aiContent?: {
    summary?: string;
    experience?: Record<string, string>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CVSchema = new Schema<ICV>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      location: String,
      linkedin: String,
      github: String,
      website: String,
      title: { type: String, required: true },
      summary: String,
    },
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        gpa: String,
        achievements: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        location: String,
        responsibilities: String,
        aiResponsibilities: String,
      },
    ],
    skills: {
      technical: [String],
      soft: [String],
      languages: [String],
      tools: [String],
    },
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String,
      },
    ],
    version: {
      type: String,
      enum: ["ats", "creative"],
      default: "ats",
    },
    aiContent: {
      summary: String,
      experience: { type: Map, of: String },
    },
  },
  { timestamps: true }
);

const CV: Model<ICV> =
  mongoose.models.CV || mongoose.model<ICV>("CV", CVSchema);

export default CV;
