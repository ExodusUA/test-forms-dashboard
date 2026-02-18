import { fullFormSchema, type Form, type FormData } from "../schemas/form";
import { formsStore } from "./forms-store";

export type FormStatus = "draft" | "active" | "archived" | "all";

export interface GetFormsOptions {
  status?: FormStatus;
  sortBy?: "updatedAt" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export async function getAllForms(options?: GetFormsOptions) {
  const allForms = await formsStore.getAll();
  let filteredForms = [...allForms];

  // Filter by status
  if (options?.status && options.status !== "all") {
    filteredForms = filteredForms.filter(
      (form) => form.status === options.status,
    );
  }

  // Sort
  const sortBy = options?.sortBy || "updatedAt";
  const sortOrder = options?.sortOrder || "desc";

  filteredForms.sort((a, b) => {
    let comparison = 0;

    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "createdAt") {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      comparison = dateA - dateB;
    } else {
      // updatedAt
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      comparison = dateA - dateB;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return filteredForms;
}

export async function getFormById(id: string) {
  const form = await formsStore.getById(parseInt(id));
  if (!form) {
    throw new Error("Form not found");
  }
  return form;
}

export async function deleteFormById(id: string) {
  const form = await formsStore.getById(parseInt(id));
  if (!form) {
    throw new Error("Form not found");
  }
  await formsStore.delete(parseInt(id));
}

export async function createForm(data: FormData): Promise<Form> {
  const maxId = await formsStore.getMaxId();
  const newId = maxId + 1;

  const now = new Date().toISOString();
  const newForm: Form = {
    id: newId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const validatedForm = fullFormSchema.parse(newForm);
  await formsStore.create(validatedForm);

  return validatedForm;
}

export async function updateFormById(
  id: string,
  data: FormData,
): Promise<Form> {
  const existingForm = await formsStore.getById(parseInt(id));
  if (!existingForm) {
    throw new Error("Form not found");
  }

  const updatedForm: Form = {
    ...existingForm,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const validatedForm = fullFormSchema.parse(updatedForm);
  await formsStore.update(parseInt(id), validatedForm);

  return validatedForm;
}
