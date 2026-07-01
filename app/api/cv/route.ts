import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { CAREER_COACH_SYSTEM_PROMPT } from "@/lib/openai";
import dbConnect from "@/lib/mongodb";
import CV from "@/models/CV";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { personalInfo, education, experience, skills, projects, version } = body;

    if (!personalInfo?.name || !personalInfo?.email || !personalInfo?.title) {
      return NextResponse.json(
        { error: "Personal info (name, email, title) is required" },
        { status: 400 }
      );
    }

    const versionType = version || "ats";

    // Build AI prompt for CV enhancement
    const cvPrompt = `Generate a professional ${versionType === "ats" ? "ATS-optimized" : "creative"} CV for:

Name: ${personalInfo.name}
Title: ${personalInfo.title}
Email: ${personalInfo.email}
Location: ${personalInfo.location || "Not specified"}

Experience:
${experience?.map((e: { role: string; company: string; startDate: string; endDate: string; responsibilities: string }) => 
  `${e.role} at ${e.company} (${e.startDate} - ${e.endDate})\n${e.responsibilities}`
).join("\n\n") || "No experience listed"}

Education:
${education?.map((e: { degree: string; institution: string; startDate: string; endDate: string }) => 
  `${e.degree} at ${e.institution} (${e.startDate} - ${e.endDate})`
).join("\n") || "No education listed"}

Technical Skills: ${skills?.technical?.join(", ") || "Not specified"}
Soft Skills: ${skills?.soft?.join(", ") || "Not specified"}

${versionType === "ats" ? 
  "Focus on: ATS keywords, action verbs, quantifiable achievements, industry-standard language" : 
  "Focus on: Compelling narrative, creative language, personality, standout phrases"
}

Generate JSON:
{
  "summary": "Professional 3-4 sentence summary optimized for ${versionType === "ats" ? "ATS systems with keywords" : "creative impression"}",
  "enhancedExperience": {
    "[company_role]": ["• Achievement 1 with metrics", "• Achievement 2 with impact", "• Achievement 3"]
  },
  "keySkillsHighlight": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
  "atsScore": ${versionType === "ats" ? 85 : 70},
  "improvements": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CAREER_COACH_SYSTEM_PROMPT },
        { role: "user", content: cvPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1500,
    });

    let aiContent: {
      summary?: string;
      enhancedExperience?: Record<string, string[]>;
      keySkillsHighlight?: string[];
      atsScore?: number;
      improvements?: string[];
    } = {};
    try {
      aiContent = JSON.parse(aiResponse.choices[0].message.content || "{}");
    } catch {
      aiContent = { summary: personalInfo.summary || "" };
    }

    // Enhance experience entries with AI
    const enhancedExperience = experience?.map((e: { role: string; company: string; startDate: string; endDate: string; location?: string; responsibilities: string }) => ({
      ...e,
      aiResponsibilities: aiContent.enhancedExperience?.[`${e.company}_${e.role}`]?.join("\n") ||
                          aiContent.enhancedExperience?.[e.company]?.join("\n") ||
                          e.responsibilities,
    })) || [];

    await dbConnect();

    const cv = await CV.create({
      userId: session.user.id,
      personalInfo: {
        ...personalInfo,
        summary: aiContent.summary || personalInfo.summary,
      },
      education: education || [],
      experience: enhancedExperience,
      skills: skills || { technical: [] },
      projects: projects || [],
      version: versionType,
      aiContent: {
        summary: aiContent.summary,
      },
    });

    return NextResponse.json({
      message: "CV generated successfully",
      cv: {
        id: cv._id.toString(),
        personalInfo: {
          ...personalInfo,
          summary: aiContent.summary || personalInfo.summary,
        },
        education: education || [],
        experience: enhancedExperience,
        skills: skills || { technical: [] },
        projects: projects || [],
        version: versionType,
        atsScore: aiContent.atsScore,
        improvements: aiContent.improvements,
        keySkillsHighlight: aiContent.keySkillsHighlight,
      },
    });
  } catch (error) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CV. Please try again." },
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
    const cvs = await CV.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("personalInfo.name personalInfo.title version createdAt")
      .lean();

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("Fetch CVs error:", error);
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 });
  }
}
