/** @jest-environment node */

import { demoCaseStore } from '@/lib/cases/demo-store';
import { NextRequest } from 'next/server';
import { GET, PATCH, PUT } from './route';

const context = {
  params: Promise.resolve({ tenantId: 'demo', caseId: 'case-001' }),
};

describe('synthetic PublicAPI-compatible case member', () => {
  beforeEach(() => {
    process.env.EAI_STARTER_DATA_MODE = 'synthetic';
    process.env.EAI_STARTER_SYNTHETIC_TENANT_ID = 'demo';
    demoCaseStore.reset();
  });

  it('gets and version-updates a case through PUT', async () => {
    const current = await (
      await GET(new NextRequest('http://local/case-001'), context)
    ).json();
    const response = await PUT(
      new NextRequest('http://local/case-001', {
        method: 'PUT',
        body: JSON.stringify({
          data: {
            ...current.data,
            status: 'resolved',
            updatedAt: '2026-09-11T01:00:00.000Z',
          },
          version: current.version,
        }),
      }),
      context,
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      operation: 'updated',
      record: { version: 2, data: { status: 'resolved' } },
    });
  });

  it('rejects stale versions, missing versions and PATCH', async () => {
    const current = demoCaseStore.get('case-001')!;
    demoCaseStore.update(
      'case-001',
      { ...current.data, status: 'resolved' },
      1,
    );

    const stale = await PUT(
      new NextRequest('http://local/case-001', {
        method: 'PUT',
        body: JSON.stringify({ data: current.data, version: 1 }),
      }),
      context,
    );
    expect(stale.status).toBe(409);
    await expect(stale.json()).resolves.toMatchObject({
      error: { code: 'STALE_RESOURCE_VERSION', currentVersion: 2 },
    });

    const missing = await PUT(
      new NextRequest('http://local/case-001', {
        method: 'PUT',
        body: JSON.stringify({ data: current.data }),
      }),
      context,
    );
    expect(missing.status).toBe(422);

    const wrongMethod = await PATCH();
    expect(wrongMethod.status).toBe(405);
    await expect(wrongMethod.json()).resolves.toMatchObject({
      error: { code: 'INVALID_V4_RESOURCE_UPDATE_METHOD' },
    });
  });
});
