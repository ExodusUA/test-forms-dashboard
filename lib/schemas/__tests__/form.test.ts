import { formSchema } from "@/lib/schemas/form";

describe("Form validation", () => {
  it("accepts valid form", () => {
    const form = {
      title: "Contact form",
      description: "Customer support",
      fieldsCount: 5,
      status: "draft",
    };

    expect(formSchema.safeParse(form).success).toBe(true);
  });

  it("rejects short title", () => {
    const form = {
      title: "ab",
      description: "Test",
      fieldsCount: 5,
      status: "draft",
    };

    expect(formSchema.safeParse(form).success).toBe(false);
  });

  it("rejects invalid status", () => {
    const form = {
      title: "Valid title",
      description: "Test",
      fieldsCount: 5,
      status: "wrong",
    };

    expect(formSchema.safeParse(form).success).toBe(false);
  });

  it("validates field count limits", () => {
    const negative = {
      title: "Test",
      description: "",
      fieldsCount: -1,
      status: "draft",
    };
    const tooMany = {
      title: "Test",
      description: "",
      fieldsCount: 100,
      status: "draft",
    };

    expect(formSchema.safeParse(negative).success).toBe(false);
    expect(formSchema.safeParse(tooMany).success).toBe(false);
  });
});
