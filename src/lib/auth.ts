import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "daily_dinlipi_token";
const TOKEN_EXPIRES_IN = "7d";

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or too short");
  }

  return new TextEncoder().encode(secret);
}

export { COOKIE_NAME };

export async function createAuthToken(user: {
  id: string;
  role: string;
}) {
  return new SignJWT({
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRES_IN)
    .sign(getSecret());
}

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (!payload.sub || typeof payload.role !== "string") {
      return null;
    }

    return {
      userId: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}