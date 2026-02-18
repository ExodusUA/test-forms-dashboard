import { authenticateUser } from "@/lib/auth/user-service";
import { loginSchema } from "@/lib/schemas/auth";
import { handleApiError } from "@/lib/utils/error-handler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = loginSchema.parse(body);

    const token = await authenticateUser(
      validatedData.email,
      validatedData.role,
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: validatedData,
    });

    // Set token cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
