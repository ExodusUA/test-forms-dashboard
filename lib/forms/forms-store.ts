import { Redis } from "@upstash/redis";
import { fullFormSchema, type Form } from "../schemas/form";
import SEED_DATA from "@/data/forms.json";

const FORMS_KEY = "forms:all";

// Initialize Redis client
// Credentials will be set via Vercel Environment Variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

class FormsStore {
  private instanceId: string;

  constructor() {
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`[FormsStore ${this.instanceId}] Initialized`);
  }

  async getAll(): Promise<Form[]> {
    console.log(`[FormsStore ${this.instanceId}] getAll() called`);

    const forms = await redis.get<Form[]>(FORMS_KEY);

    if (!forms || forms.length === 0) {
      console.log(
        `[FormsStore ${this.instanceId}] No forms in Redis, initializing with seed data`,
      );
      const seedForms = SEED_DATA.map((form) => fullFormSchema.parse(form));
      await redis.set(FORMS_KEY, seedForms);
      console.log(
        `[FormsStore ${this.instanceId}] Initialized ${seedForms.length} forms`,
      );
      return seedForms;
    }

    console.log(
      `[FormsStore ${this.instanceId}] Returning ${forms.length} forms from Redis`,
    );
    return forms;
  }

  async getById(id: number): Promise<Form | undefined> {
    console.log(`[FormsStore ${this.instanceId}] getById(${id})`);
    const forms = await this.getAll();
    const form = forms.find((f) => f.id === id);
    console.log(
      `[FormsStore ${this.instanceId}] getById(${id}) - ${form ? "found" : "not found"}`,
    );
    return form;
  }

  async create(form: Form): Promise<void> {
    console.log(
      `[FormsStore ${this.instanceId}] create() - new ID: ${form.id}`,
    );
    const forms = await this.getAll();
    forms.push(form);
    await redis.set(FORMS_KEY, forms);
    console.log(
      `[FormsStore ${this.instanceId}] create() - saved, total: ${forms.length}`,
    );
  }

  async update(id: number, updatedForm: Form): Promise<void> {
    console.log(`[FormsStore ${this.instanceId}] update(${id})`);
    const forms = await this.getAll();
    const index = forms.findIndex((f) => f.id === id);

    if (index !== -1) {
      forms[index] = updatedForm;
      await redis.set(FORMS_KEY, forms);
      console.log(`[FormsStore ${this.instanceId}] update(${id}) - saved`);
    } else {
      console.log(`[FormsStore ${this.instanceId}] update(${id}) - not found`);
    }
  }

  async delete(id: number): Promise<void> {
    console.log(`[FormsStore ${this.instanceId}] delete(${id})`);
    const forms = await this.getAll();
    const initialCount = forms.length;
    const filtered = forms.filter((f) => f.id !== id);
    await redis.set(FORMS_KEY, filtered);
    console.log(
      `[FormsStore ${this.instanceId}] delete(${id}) - ${initialCount} -> ${filtered.length}`,
    );
  }

  async getMaxId(): Promise<number> {
    const forms = await this.getAll();
    const maxId = forms.length > 0 ? Math.max(...forms.map((f) => f.id)) : 0;
    console.log(`[FormsStore ${this.instanceId}] getMaxId() - ${maxId}`);
    return maxId;
  }
}

// Module-level singleton instance
console.log("[FormsStore] Creating singleton instance...");
export const formsStore = new FormsStore();
console.log("[FormsStore] Singleton instance created");
