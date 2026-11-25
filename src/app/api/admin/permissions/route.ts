
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/admin-auth";

const permissionSchema = z.object({
  canViewUsers: z.boolean(),
  canEditUsers: z.boolean(),
  canChangeUserRoles: z.boolean(),
  canDeleteUsers: z.boolean(),
  canChangeUserStatus: z.boolean(),
});

const updateSchema = z.object({
  userId: z.string().min(1),
  ...permissionSchema.shape,
});

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

async function requireSuperAdmin() {
  const admin = await getAdminUser();

  if (!admin) {
    return {
      admin: null,
      response: errorResponse("Unauthorized", 401),
    };
  }

  if (admin.role !== "SUPER_ADMIN") {
    return {
      admin: null,
      response: errorResponse(
        "শুধুমাত্র Super Admin permission পরিচালনা করতে পারবেন",
        403
      ),
    };
  }

  return { admin, response: null };
}

// GET: Admin and Editor permission list
export async function GET() {
  try {
    const auth = await requireSuperAdmin();

    if (auth.response) {
      return auth.response;
    }

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "EDITOR"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        adminPermission: {
          select: {
            canViewUsers: true,
            canEditUsers: true,
            canChangeUserRoles: true,
            canDeleteUsers: true,
            canChangeUserStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      permissions: {
        canViewUsers: user.adminPermission?.canViewUsers ?? false,
        canEditUsers: user.adminPermission?.canEditUsers ?? false,
        canChangeUserRoles:
          user.adminPermission?.canChangeUserRoles ?? false,
        canDeleteUsers: user.adminPermission?.canDeleteUsers ?? false,
        canChangeUserStatus:
          user.adminPermission?.canChangeUserStatus ?? false,
      },
    }));

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("ADMIN_PERMISSIONS_GET_ERROR:", error);

    return errorResponse(
      "Permission list load করতে সমস্যা হয়েছে",
      500
    );
  }
}

// PATCH: Update a user's permissions
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin();

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Permission data সঠিক নয়",
          errors: validation.error.flatten(),
        },
        { status: 422 }
      );
    }

    const {
      userId,
      canViewUsers,
      canEditUsers,
      canChangeUserRoles,
      canDeleteUsers,
      canChangeUserStatus,
    } = validation.data;

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!targetUser) {
      return errorResponse("User পাওয়া যায়নি", 404);
    }

    if (!["ADMIN", "EDITOR"].includes(targetUser.role)) {
      return errorResponse(
        "শুধুমাত্র ADMIN অথবা EDITOR-এর permission পরিবর্তন করা যাবে",
        403
      );
    }

    const permissions = {
      canViewUsers,
      canEditUsers,
      canChangeUserRoles,
      canDeleteUsers,
      canChangeUserStatus,
    };

    const updated = await prisma.adminPermission.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ...permissions,
      },
      update: permissions,
      select: {
        userId: true,
        canViewUsers: true,
        canEditUsers: true,
        canChangeUserRoles: true,
        canDeleteUsers: true,
        canChangeUserStatus: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User permissions সফলভাবে update হয়েছে",
      data: updated,
    });
  } catch (error) {
    console.error("ADMIN_PERMISSIONS_PATCH_ERROR:", error);

    return errorResponse(
      "Permission update করতে সমস্যা হয়েছে",
      500
    );
  }
}
