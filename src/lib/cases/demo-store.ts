import type {
  CaseListResponse,
  CaseMutationReceipt,
  CustomerCaseData,
  CustomerCaseRecord,
} from './contracts';

const SEED_CASES: CustomerCaseRecord[] = [
  {
    id: 'case-001',
    version: 1,
    data: {
      caseNumber: 'CASE-1042',
      title: 'Permit evidence needs review',
      description:
        'Confirm the submitted evidence meets the permit conditions.',
      status: 'in_progress',
      priority: 'high',
      customerName: 'Harbour Works',
      ownerName: 'Jordan Lee',
      updatedAt: '2026-09-10T23:15:00.000Z',
    },
  },
  {
    id: 'case-002',
    version: 3,
    data: {
      caseNumber: 'CASE-1037',
      title: 'Update billing contact',
      description:
        'Customer requested a billing contact change for future notices.',
      status: 'waiting_on_customer',
      priority: 'medium',
      customerName: 'Northern Logistics',
      ownerName: 'Avery Chen',
      updatedAt: '2026-09-10T08:40:00.000Z',
    },
  },
  {
    id: 'case-003',
    version: 2,
    data: {
      caseNumber: 'CASE-1029',
      title: 'Access restored after identity review',
      description:
        'External user access was restored after membership verification.',
      status: 'resolved',
      priority: 'low',
      customerName: 'Civic Partners',
      ownerName: 'Jordan Lee',
      updatedAt: '2026-09-09T05:20:00.000Z',
    },
  },
];

function cloneRecord(record: CustomerCaseRecord): CustomerCaseRecord {
  return { ...record, data: { ...record.data } };
}

class DemoCaseStore {
  private records = new Map<string, CustomerCaseRecord>();
  private idempotency = new Map<string, string>();
  private nextId = 4;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.records = new Map(
      SEED_CASES.map((record) => [record.id, cloneRecord(record)]),
    );
    this.idempotency.clear();
    this.nextId = 4;
  }

  list(limit: number): CaseListResponse {
    const docs = Array.from(this.records.values())
      .sort((a, b) => b.data.updatedAt.localeCompare(a.data.updatedAt))
      .slice(0, limit)
      .map(cloneRecord);
    return { docs, total: this.records.size };
  }

  get(id: string): CustomerCaseRecord | undefined {
    const record = this.records.get(id);
    return record ? cloneRecord(record) : undefined;
  }

  create(data: CustomerCaseData, idempotencyKey?: string): CaseMutationReceipt {
    if (idempotencyKey) {
      const existingId = this.idempotency.get(idempotencyKey);
      const existing = existingId ? this.records.get(existingId) : undefined;
      if (existing)
        return { operation: 'created', record: cloneRecord(existing) };
    }

    const id = `case-${String(this.nextId).padStart(3, '0')}`;
    this.nextId += 1;
    const record: CustomerCaseRecord = { id, version: 1, data: { ...data } };
    this.records.set(id, record);
    if (idempotencyKey) this.idempotency.set(idempotencyKey, id);
    return { operation: 'created', record: cloneRecord(record) };
  }

  update(
    id: string,
    data: CustomerCaseData,
    version: number,
  ): CaseMutationReceipt | { conflict: number } | undefined {
    const existing = this.records.get(id);
    if (!existing) return undefined;
    if (existing.version !== version) return { conflict: existing.version };

    const record: CustomerCaseRecord = {
      id,
      version: version + 1,
      data: { ...data },
    };
    this.records.set(id, record);
    return { operation: 'updated', record: cloneRecord(record) };
  }
}

export const demoCaseStore = new DemoCaseStore();
