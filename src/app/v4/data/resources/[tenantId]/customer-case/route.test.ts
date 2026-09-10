/** @jest-environment node */

import { demoCaseStore } from '@/lib/cases/demo-store';
import type { CustomerCaseData } from '@/lib/cases/contracts';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

const context = { params: Promise.resolve({ tenantId: 'demo' }) };
const sample: CustomerCaseData = {
  caseNumber: 'CASE-2001',
  title: 'Confirm community consultation',
  description: 'Validate that consultation evidence is complete.',
  status: 'new',
  priority: 'high',
  customerName: 'Coastal Council',
  ownerName: 'Sam Taylor',
  updatedAt: '2026-09-11T00:00:00.000Z',
};

describe('synthetic PublicAPI-compatible case collection', () => {
  beforeEach(() => {
    process.env.EAI_STARTER_DATA_MODE = 'synthetic';
    process.env.EAI_STARTER_SYNTHETIC_TENANT_ID = 'demo';
    demoCaseStore.reset();
  });

  it('lists deterministic cases with a bounded total', async () => {
    const response = await GET(
      new NextRequest(
        'http://local/v4/data/resources/demo/customer-case?limit=2',
      ),
      context,
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      total: 3,
      docs: expect.arrayContaining([
        expect.objectContaining({ id: 'case-001', version: 1 }),
      ]),
    });
  });

  it('creates once for a repeated idempotency key', async () => {
    const request = () =>
      new NextRequest('http://local/v4/data/resources/demo/customer-case', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: sample, idempotencyKey: 'demo-create-1' }),
      });
    const first = await POST(request(), context);
    const second = await POST(request(), context);
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect((await first.json()).record.id).toBe(
      (await second.json()).record.id,
    );
    expect(demoCaseStore.list(50).total).toBe(4);
  });

  it('rejects flat mutation bodies and a different tenant', async () => {
    const flat = await POST(
      new NextRequest('http://local/v4/data/resources/demo/customer-case', {
        method: 'POST',
        body: JSON.stringify(sample),
      }),
      context,
    );
    expect(flat.status).toBe(422);
    await expect(flat.json()).resolves.toMatchObject({
      error: { code: 'INVALID_V4_RESOURCE_CREATE_BODY' },
    });

    const denied = await GET(
      new NextRequest('http://local/v4/data/resources/customer/customer-case'),
      { params: Promise.resolve({ tenantId: 'customer' }) },
    );
    expect(denied.status).toBe(403);
  });
});
