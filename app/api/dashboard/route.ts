import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import CV from "@/models/CV";
import Interview from "@/models/Interview";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [portfolios, cvs, interviews] = await Promise.all([
      Portfolio.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .select("name title theme shareId createdAt")
        .limit(3)
        .lean(),
      CV.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .select("personalInfo.name personalInfo.title version createdAt")
        .limit(3)
        .lean(),
      Interview.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .select("role difficulty status overallScore createdAt")
        .limit(3)
        .lean(),
    ]);

    const [portfolioCount, cvCount, interviewCount] = await Promise.all([
      Portfolio.countDocuments({ userId: session.user.id }),
      CV.countDocuments({ userId: session.user.id }),
      Interview.countDocuments({ userId: session.user.id, status: "completed" }),
    ]);

    // Calculate average interview score
    const completedInterviews = await Interview.find({
      userId: session.user.id,
      status: "completed",
      overallScore: { $exists: true },
    }).select("overallScore");

    const avgScore =
      completedInterviews.length > 0
        ? (
            completedInterviews.reduce(
              (sum, i) => sum + (i.overallScore || 0),
              0
            ) / completedInterviews.length
          ).toFixed(1)
        : null;

    return NextResponse.json({
      stats: {
        portfolioCount,
        cvCount,
        interviewCount,
        avgInterviewScore: avgScore,
      },
      recent: {
        portfolios,
        cvs,
        interviews,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
