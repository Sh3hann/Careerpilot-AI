import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPortfolio extends Document {
  userId: Types.ObjectId;
  name: string;
  title: string;
  about: string;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    aiDescription?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
    aiDescription?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact: {
    email: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  theme: "developer" | "designer" | "minimal";
  aiAbout?: string;
  htmlContent?: string;
  shareId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    skills: [{ type: String }],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String,
        github: String,
        aiDescription: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
        aiDescription: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    contact: {
      email: String,
      github: String,
      linkedin: String,
      website: String,
    },
    theme: {
      type: String,
      enum: ["developer", "designer", "minimal"],
      default: "developer",
    },
    aiAbout: String,
    htmlContent: String,
    shareId: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 10),
    },
  },
  { timestamps: true }
);

const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
