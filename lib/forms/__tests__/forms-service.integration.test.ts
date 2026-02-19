/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock Redis for testing
const mockRedisData = new Map<string, any>();

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(async (key: string) => mockRedisData.get(key)),
    set: jest.fn(async (key: string, value: any) => {
      mockRedisData.set(key, value);
      return 'OK';
    }),
  })),
}));

jest.mock('@/data/forms.json', () => []);

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      json: async () => data,
      status: init?.status || 200,
    }),
  },
}));

jest.mock('@/lib/auth/api-helpers', () => ({
  requireAdmin: jest.fn(async () => true),
}));

import {
  getAllForms,
  getFormById,
  createForm,
  updateFormById,
  deleteFormById,
} from '@/lib/forms/forms-service';

describe('Forms Service', () => {
  beforeEach(() => {
    mockRedisData.clear();
  });

  describe('Basic CRUD', () => {
    it('creates and retrieves a form', async () => {
      const form = await createForm({
        title: 'New contact form',
        description: 'For customer inquiries',
        fieldsCount: 5,
        status: 'draft',
      });

      expect(form.id).toBeDefined();
      expect(form.title).toBe('New contact form');

      const found = await getFormById(form.id.toString());
      expect(found?.id).toBe(form.id);
    });

    it('updates form fields', async () => {
      const form = await createForm({
        title: 'Draft form',
        description: 'Work in progress',
        fieldsCount: 3,
        status: 'draft',
      });

      const updated = await updateFormById(form.id.toString(), {
        title: 'Contact form',
        description: 'Ready to use',
        fieldsCount: 5,
        status: 'active',
      });

      expect(updated.title).toBe('Contact form');
      expect(updated.status).toBe('active');
    });

    it('deletes a form', async () => {
      const form = await createForm({
        title: 'Temp form',
        description: 'Will delete this',
        fieldsCount: 2,
        status: 'draft',
      });

      await deleteFormById(form.id.toString());
      await expect(getFormById(form.id.toString())).rejects.toThrow();
    });

    it('throws on missing form', async () => {
      await expect(getFormById('999')).rejects.toThrow('Form not found');
    });
  });

  describe('Filtering', () => {
    beforeEach(async () => {
      await createForm({
        title: 'Draft 1',
        description: 'Not ready',
        fieldsCount: 2,
        status: 'draft',
      });
      await createForm({
        title: 'Active form',
        description: 'Live',
        fieldsCount: 5,
        status: 'active',
      });
    });

    it('filters by status', async () => {
      const drafts = await getAllForms({ status: 'draft' });
      expect(drafts.every(f => f.status === 'draft')).toBe(true);

      const active = await getAllForms({ status: 'active' });
      expect(active.every(f => f.status === 'active')).toBe(true);
    });

    it('sorts by title', async () => {
      const asc = await getAllForms({ sortBy: 'title', sortOrder: 'asc' });
      for (let i = 1; i < asc.length; i++) {
        expect(asc[i].title >= asc[i - 1].title).toBe(true);
      }
    });
  });

  describe('Validation', () => {
    it('rejects short title', async () => {
      await expect(createForm({
        title: 'ab',
        description: 'Test',
        fieldsCount: 5,
        status: 'draft',
      })).rejects.toThrow();
    });

    it('rejects too many fields', async () => {
      await expect(createForm({
        title: 'Valid title',
        description: 'Test',
        fieldsCount: 100,
        status: 'draft',
      })).rejects.toThrow();
    });
  });
});
