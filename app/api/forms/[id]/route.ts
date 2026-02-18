import { formSchema } from "@/lib/schemas/form";
import { handleApiError } from "@/lib/utils/error-handler";
import { NextRequest, NextResponse } from "next/server";
import {
  getFormById,
  updateFormById,
  deleteFormById,
} from "@/lib/forms/forms-service";
import { requireAdmin } from "@/lib/auth/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// Get single form
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const form = await getFormById(id);

    return NextResponse.json({
      success: true,
      form,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update form (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);

    const { id } = await params;
    const body = await request.json();

    const validatedData = formSchema.parse(body);

    const updatedForm = await updateFormById(id, validatedData);

    return NextResponse.json({
      success: true,
      form: updatedForm,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete form (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin(request);

    const { id } = await params;

    await deleteFormById(id);

    return NextResponse.json({
      success: true,
      message: "Form deleted successfully",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
