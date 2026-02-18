import { formSchema } from "@/lib/schemas/form";
import { handleApiError } from "@/lib/utils/error-handler";
import { NextRequest, NextResponse } from "next/server";
import { createForm, getAllForms } from "@/lib/forms/forms-service";
import { requireAdmin } from "@/lib/auth/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Get all forms
export async function GET() {
  try {
    const forms = await getAllForms();

    return NextResponse.json({
      success: true,
      forms,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Create new form (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();

    const validatedData = formSchema.parse(body);

    const newForm = await createForm(validatedData);

    return NextResponse.json(
      {
        success: true,
        form: newForm,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
