import { NextResponse } from "next/server";
import { z } from "zod";

export function handleApiError(error: unknown) {
  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: error.issues[0].message,
      },
      { status: 400 },
    );
  }

  // Authentication/Authorization errors
  if (error instanceof Error) {
    if (
      error.message === "Authentication required" ||
      error.message === "Invalid or expired token"
    ) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 401 },
      );
    }

    if (error.message === "Admin access required") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 },
      );
    }

    if (error.message === "User not found") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (error.message === "Form not found") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 },
      );
    }

    // Generic error
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: false, error: "An unexpected error occurred" },
    { status: 500 },
  );
}
