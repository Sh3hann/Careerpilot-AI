import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { CAREER_COACH_SYSTEM_PROMPT } from "@/lib/openai";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, title, about, skills, projects, experience, education, contact, theme } = body;

    if (!name || !title || !about) {
      return NextResponse.json(
        { error: "Name, title, and about section are required" },
        { status: 400 }
      );
    }

    // Generate AI-enhanced content
    const aiPrompt = `Generate professional portfolio content for a ${title} named ${name}.

User's own description: "${about}"

Skills: ${skills?.join(", ") || "Not specified"}

Projects:
${projects?.map((p: { name: string; description: string; technologies: string[] }) => `- ${p.name}: ${p.description} (Tech: ${p.technologies?.join(", ")})`).join("\n") || "None"}

Experience:
${experience?.map((e: { role: string; company: string; duration: string; description: string }) => `- ${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n") || "None"}

Generate the following in JSON format:
{
  "aiAbout": "A compelling 3-4 sentence professional summary written in first person that highlights their expertise, passion, and value proposition. Make it engaging and specific.",
  "projectDescriptions": {
    "[project_name]": "Enhanced 2-3 sentence description focusing on impact and technical achievement"
  },
  "experienceDescriptions": {
    "[company_role]": "Enhanced 2-3 bullet points focusing on achievements and impact, starting with action verbs"
  }
}

Make it professional, specific, and achievement-focused. Use ATS-friendly language.`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CAREER_COACH_SYSTEM_PROMPT },
        { role: "user", content: aiPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    });

    let aiContent: {
      aiAbout?: string;
      projectDescriptions?: Record<string, string>;
      experienceDescriptions?: Record<string, string>;
    } = {};
    try {
      aiContent = JSON.parse(aiResponse.choices[0].message.content || "{}");
    } catch {
      aiContent = { aiAbout: about };
    }

    // Enhance projects with AI descriptions
    const enhancedProjects = projects?.map((p: { name: string; description: string; technologies: string[]; url?: string; github?: string }) => ({
      ...p,
      aiDescription: aiContent.projectDescriptions?.[p.name] || p.description,
    })) || [];

    // Enhance experience with AI descriptions
    const enhancedExperience = experience?.map((e: { role: string; company: string; duration: string; description: string }) => ({
      ...e,
      aiDescription: aiContent.experienceDescriptions?.[`${e.company}_${e.role}`] || 
                     aiContent.experienceDescriptions?.[e.company] ||
                     e.description,
    })) || [];

    await dbConnect();

    const portfolio = await Portfolio.create({
      userId: session.user.id,
      name,
      title,
      about,
      skills: skills || [],
      projects: enhancedProjects,
      experience: enhancedExperience,
      education: education || [],
      contact: contact || {},
      theme: theme || "developer",
      aiAbout: aiContent.aiAbout || about,
    });

    return NextResponse.json({
      message: "Portfolio generated successfully",
      portfolio: {
        id: portfolio._id.toString(),
        shareId: portfolio.shareId,
        aiAbout: portfolio.aiAbout,
        enhancedProjects,
        enhancedExperience,
        theme: portfolio.theme,
      },
    });
  } catch (error) {
    console.error("Portfolio generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate portfolio. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const portfolios = await Portfolio.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("name title theme shareId createdAt")
      .lean();

    return NextResponse.json({ portfolios });
  } catch (error) {
    console.error("Fetch portfolios error:", error);
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
  }
}
