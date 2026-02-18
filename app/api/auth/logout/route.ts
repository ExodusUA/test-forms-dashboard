import { handleApiError } from "@/lib/utils/error-handler";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // Delete token cookie
    response.cookies.delete("token");

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
