
import { prisma } from "@/lib/prisma";

export type AdminPermissionKey =
  | "canViewUsers"
  | "canEditUsers"
  | "canChangeUserRoles"
  | "canDeleteUsers"
  | "canChangeUserStatus";

export const ADMIN_PERMISSION_FIELDS = [
  "canViewUsers",
  "canEditUsers",
  "canChangeUserRoles",
  "canDeleteUsers",
  "canChangeUserStatus",
] as const;

export type AdminPermissions = Record<AdminPermissionKey, boolean>;

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  canViewUsers: false,
  canEditUsers: false,
  canChangeUserRoles: false,
  canDeleteUsers: false,
  canChangeUserStatus: false,
};

export async function hasAdminPermission(
  userId: string,
  role: string,
  permission: AdminPermissionKey
): Promise<boolean> {
  if (role === "SUPER_ADMIN") return true;

  const permissions = await prisma.adminPermission.findUnique({
    where: { userId },
    select: {
      canViewUsers: true,
      canEditUsers: true,
      canChangeUserRoles: true,
      canDeleteUsers: true,
      canChangeUserStatus: true,
    },
  });

  return permissions?.[permission] ?? false;
}

export async function hasAllAdminPermissions(
  userId: string,
  role: string,
  required: AdminPermissionKey[]
): Promise<boolean> {
  if (role === "SUPER_ADMIN") return true;

  const permissions = await prisma.adminPermission.findUnique({
    where: { userId },
    select: {
      canViewUsers: true,
      canEditUsers: true,
      canChangeUserRoles: true,
      canDeleteUsers: true,
      canChangeUserStatus: true,
    },
  });

  if (!permissions) return false;

  return required.every((permission) => permissions[permission]);
}
