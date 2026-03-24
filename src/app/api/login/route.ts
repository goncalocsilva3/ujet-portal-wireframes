import { NextResponse } from "next/server";

const PASSWORD = process.env.PROTOTYPE_PASSWORD || "ujetportal2026";

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("prototype-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
}
