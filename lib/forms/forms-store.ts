import { Redis } from "@upstash/redis";
import { fullFormSchema, type Form } from "../schemas/form";
import SEED_DATA from "@/data/forms.json";

const FORMS_KEY = "forms:all";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

class FormsStore {
  async getAll(): Promise<Form[]> {
    const forms = await redis.get<Form[]>(FORMS_KEY);

    if (!forms || forms.length === 0) {
      const seedForms = SEED_DATA.map((form) => fullFormSchema.parse(form));
      await redis.set(FORMS_KEY, seedForms);
      return seedForms;
    }

    return forms;
  }

  async getById(id: number): Promise<Form | undefined> {
    const forms = await this.getAll();
    return forms.find((f) => f.id === id);
  }

  async create(form: Form): Promise<void> {
    const forms = await this.getAll();
    forms.push(form);
    await redis.set(FORMS_KEY, forms);
  }

  async update(id: number, updatedForm: Form): Promise<void> {
    const forms = await this.getAll();
    const index = forms.findIndex((f) => f.id === id);

    if (index !== -1) {
      forms[index] = updatedForm;
      await redis.set(FORMS_KEY, forms);
    }
  }

  async delete(id: number): Promise<void> {
    const forms = await this.getAll();
    const filtered = forms.filter((f) => f.id !== id);
    await redis.set(FORMS_KEY, filtered);
  }

  async getMaxId(): Promise<number> {
    const forms = await this.getAll();
    return forms.length > 0 ? Math.max(...forms.map((f) => f.id)) : 0;
  }
}

export const formsStore = new FormsStore();
