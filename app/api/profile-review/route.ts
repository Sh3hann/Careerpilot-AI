import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import openai, { CAREER_COACH_SYSTEM_PROMPT } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, type, url } = body;

    let contentToAnalyze = text || "";

    if (url) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return NextResponse.json(
          { error: "Please enter a valid URL starting with http:// or https://" },
          { status: 400 }
        );
      }
      try {
        console.log(`Fetching portfolio URL: ${url}`);
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          next: { revalidate: 0 }, // bypass caching
        });
        if (!response.ok) {
          return NextResponse.json(
            { error: `Failed to fetch the website. Server returned status ${response.status}.` },
            { status: 400 }
          );
        }
        const html = await response.text();
        
        // Strip scripts, styles, and HTML tags
        contentToAnalyze = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        if (contentToAnalyze.length < 50) {
          return NextResponse.json(
            { error: "Could not extract enough readable text from the provided URL. Please paste the text manually." },
            { status: 400 }
          );
        }

        // Limit length to avoid token overuse
        contentToAnalyze = contentToAnalyze.slice(0, 10000);
      } catch (fetchErr: any) {
        console.error("Fetch URL error:", fetchErr);
        return NextResponse.json(
          { error: `Could not connect to the URL: ${fetchErr.message || fetchErr}` },
          { status: 400 }
        );
      }
    }

    if (!contentToAnalyze || contentToAnalyze.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide CV/portfolio text of at least 50 characters, or a valid portfolio link." },
        { status: 400 }
      );
    }

    const reviewPrompt = `You are reviewing the following ${type === "portfolio" ? "portfolio" : "CV/resume"} text for a job seeker. Provide a comprehensive, honest, and actionable review.

${type === "portfolio" ? "Portfolio" : "CV/Resume"} Text:
"""
${contentToAnalyze}
"""

Analyze this thoroughly and respond in JSON:
{
  "overallScore": 72,
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3",
    "Specific strength 4"
  ],
  "weaknesses": [
    "Specific weakness 1",
    "Specific weakness 2",
    "Specific weakness 3"
  ],
  "missingSkills": [
    "Missing skill or section 1",
    "Missing skill or section 2",
    "Missing skill or section 3"
  ],
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3",
    "Actionable suggestion 4",
    "Actionable suggestion 5"
  ],
  "atsScore": 68,
  "readabilityScore": 75,
  "impactScore": 65,
  "rewrittenVersion": "Complete professionally rewritten version of the CV/portfolio content that incorporates all suggestions. Make it compelling, ATS-optimized, and professional. Include all sections properly formatted.",
  "keywordsMissing": ["keyword1", "keyword2", "keyword3"],
  "topPriority": "The single most important thing to improve immediately"
}

Be specific and reference actual content from their text. The rewritten version should be substantially better.`;

    const reviewResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: CAREER_COACH_SYSTEM_PROMPT },
        { role: "user", content: reviewPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 2500,
    });

    let review: {
      overallScore?: number;
      strengths?: string[];
      weaknesses?: string[];
      missingSkills?: string[];
      suggestions?: string[];
      atsScore?: number;
      readabilityScore?: number;
      impactScore?: number;
      rewrittenVersion?: string;
      keywordsMissing?: string[];
      topPriority?: string;
    } = {};
    try {
      review = JSON.parse(reviewResponse.choices[0].message.content || "{}");
    } catch {
      review = {
        overallScore: 50,
        strengths: ["Unable to parse review"],
        weaknesses: ["Please try again"],
        suggestions: ["Resubmit for analysis"],
      };
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Profile review error:", error);
    return NextResponse.json(
      { error: "Failed to analyze your profile. Please try again." },
      { status: 500 }
    );
  }
}
