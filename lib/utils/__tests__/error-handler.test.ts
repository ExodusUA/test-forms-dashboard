/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleApiError } from "../error-handler";
import { z } from "zod";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 500,
    })),
  },
}));

describe("Error handler", () => {
  it("handles generic errors", async () => {
    const error = new Error("Something broke");
    const response = handleApiError(error);
    const data = await response.json();

    expect(data.error).toBe("Something broke");
    expect(response.status).toBe(500);
  });

  it("formats Zod errors", async () => {
    const schema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
    });

    try {
      schema.parse({ title: "ab" });
    } catch (error) {
      const response = handleApiError(error);
      const data = await response.json();

      expect(data.error).toContain("Title must be at least 3 characters");
    }
  });
});
