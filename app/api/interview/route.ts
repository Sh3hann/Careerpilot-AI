import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { CAREER_COACH_SYSTEM_PROMPT } from "@/lib/openai";
import dbConnect from "@/lib/mongodb";
import Interview from "@/models/Interview";

const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "Product Manager",
  "Software Engineer",
  "Machine Learning Engineer",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, role, difficulty, interviewId, userMessage, conversation } = body;

    await dbConnect();

    // Start a new interview
    if (action === "start") {
      if (!role || !difficulty) {
        return NextResponse.json(
          { error: "Role and difficulty are required" },
          { status: 400 }
        );
      }

      const difficultyGuide = {
        easy: "Ask foundational questions suitable for junior candidates. Focus on basic concepts and simple scenarios.",
        medium: "Ask intermediate questions for mid-level candidates. Include problem-solving and some architectural questions.",
        hard: "Ask advanced questions for senior candidates. Include complex system design, trade-offs, and leadership scenarios.",
      };

      const systemPrompt = `${CAREER_COACH_SYSTEM_PROMPT}

You are currently conducting a ${difficulty.toUpperCase()} difficulty interview for a ${role} position.

Interview Guidelines:
- ${difficultyGuide[difficulty as keyof typeof difficultyGuide]}
- Ask ONE question at a time
- After each answer, provide brief encouraging feedback (1-2 sentences), then ask the next question
- Be professional but approachable
- Track the interview progress naturally
- After 5-7 questions, you can wrap up

Start by greeting the candidate professionally and asking your first interview question.`;

      const startResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Start the interview for ${role} position at ${difficulty} difficulty.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 400,
      });

      const firstMessage = startResponse.choices[0].message.content || "";

      const interview = await Interview.create({
        userId: session.user.id,
        role,
        difficulty,
        conversation: [
          {
            role: "assistant",
            content: firstMessage,
            timestamp: new Date(),
          },
        ],
        status: "in-progress",
      });

      return NextResponse.json({
        interviewId: interview._id.toString(),
        message: firstMessage,
      });
    }

    // Continue interview conversation
    if (action === "chat") {
      if (!interviewId || !userMessage) {
        return NextResponse.json(
          { error: "Interview ID and message are required" },
          { status: 400 }
        );
      }

      const interview = await Interview.findById(interviewId);
      if (!interview || interview.userId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Interview not found" }, { status: 404 });
      }

      // Build conversation history for OpenAI
      const messages = [
        {
          role: "system" as const,
          content: `${CAREER_COACH_SYSTEM_PROMPT}

You are conducting a ${interview.difficulty.toUpperCase()} difficulty interview for a ${interview.role} position.
- Ask ONE question at a time
- Give brief feedback on the answer (1-2 sentences), then ask next question
- Be professional and constructive
- After about 5-7 exchanges total, naturally conclude the interview`,
        },
        ...interview.conversation.map((msg) => ({
          role: msg.role as "assistant" | "user",
          content: msg.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.8,
        max_tokens: 400,
      });

      const aiReply = chatResponse.choices[0].message.content || "";

      // Save to database
      interview.conversation.push(
        { role: "user", content: userMessage, timestamp: new Date() },
        { role: "assistant", content: aiReply, timestamp: new Date() }
      );
      await interview.save();

      return NextResponse.json({ message: aiReply });
    }

    // End interview and generate report
    if (action === "end") {
      if (!interviewId) {
        return NextResponse.json(
          { error: "Interview ID is required" },
          { status: 400 }
        );
      }

      const interview = await Interview.findById(interviewId);
      if (!interview || interview.userId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Interview not found" }, { status: 404 });
      }

      const conversationText = interview.conversation
        .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
        .join("\n\n");

      const reportPrompt = `Analyze this ${interview.role} job interview conversation and generate a comprehensive evaluation report.

Interview Transcript:
${conversationText}

Generate a JSON evaluation report:
{
  "overallScore": 7.5,
  "summary": "2-3 sentence overall assessment of the candidate",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["area to improve 1", "area to improve 2", "area to improve 3"],
  "recommendations": "2-3 specific, actionable recommendations for improvement",
  "answerScores": [
    {"question": "brief question summary", "score": 8, "feedback": "specific feedback"}
  ],
  "hiringDecision": "Strong Yes / Yes / Maybe / No",
  "hiringReason": "Brief reason for the hiring decision"
}

Be specific, honest, and constructive. Base scores on actual answer quality.`;

      const reportResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: CAREER_COACH_SYSTEM_PROMPT },
          { role: "user", content: reportPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
        max_tokens: 1500,
      });

      let report: {
        overallScore?: number;
        summary?: string;
        strengths?: string[];
        improvements?: string[];
        recommendations?: string;
        answerScores?: Array<{ question: string; score: number; feedback: string }>;
        hiringDecision?: string;
        hiringReason?: string;
      } = {};
      try {
        report = JSON.parse(reportResponse.choices[0].message.content || "{}");
      } catch {
        report = {
          overallScore: 6,
          summary: "Interview completed successfully.",
          strengths: ["Participated in interview"],
          improvements: ["Practice more"],
          recommendations: "Continue practicing interview skills.",
        };
      }

      interview.status = "completed";
      interview.overallScore = report.overallScore;
      interview.report = {
        summary: report.summary || "",
        strengths: report.strengths || [],
        improvements: report.improvements || [],
        recommendations: report.recommendations || "",
      };
      await interview.save();

      return NextResponse.json({ report, interviewId: interview._id.toString() });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Interview error:", error);
    return NextResponse.json(
      { error: "Interview service error. Please try again." },
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
    const interviews = await Interview.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select("role difficulty status overallScore createdAt")
      .lean();

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Fetch interviews error:", error);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}
