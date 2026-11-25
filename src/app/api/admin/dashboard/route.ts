
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "অনুমতি নেই" },
        { status: 401 }
      );
    }

    const session = await verifyAuthToken(token);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "সেশন বৈধ নয়" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (
      !currentUser ||
      !currentUser.isActive ||
      !ADMIN_ROLES.includes(currentUser.role)
    ) {
      return NextResponse.json(
        { success: false, message: "এই তথ্য দেখার অনুমতি নেই" },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalArticles,
      publishedArticles,
      draftArticles,
      pendingComments,
      totalCategories,
      totalVideos,
      totalGalleries,
      totalSubmissions,
      totalApplications,
      viewsResult,
      recentArticles,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.article.count(),

      prisma.article.count({
        where: { status: "PUBLISHED" },
      }),

      prisma.article.count({
        where: { status: "DRAFT" },
      }),

      prisma.comment.count({
        where: { status: "PENDING" },
      }),

      prisma.category.count(),

      prisma.video.count(),

      prisma.gallery.count(),

      prisma.newsSubmission.count({
        where: { status: "PENDING" },
      }),

      prisma.careerApplication.count(),

      prisma.article.aggregate({
        _sum: {
          viewCount: true,
        },
      }),

      prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalArticles,
        publishedArticles,
        draftArticles,
        pendingComments,
        totalCategories,
        totalVideos,
        totalGalleries,
        pendingNewsSubmissions: totalSubmissions,
        careerApplications: totalApplications,
        totalViews: viewsResult._sum.viewCount ?? 0,
        recentArticles,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "ড্যাশবোর্ড লোড করা যায়নি",
      },
      { status: 500 }
    );
  }
}
