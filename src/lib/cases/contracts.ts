export const CASE_STATUSES = [
  'new',
  'in_progress',
  'waiting_on_customer',
  'resolved',
] as const;

export const CASE_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];
export type CasePriority = (typeof CASE_PRIORITIES)[number];

export interface CustomerCaseData {
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  customerName: string;
  ownerName: string;
  updatedAt: string;
}

export interface CustomerCaseRecord {
  id: string;
  version: number;
  data: CustomerCaseData;
}

export interface CaseListResponse {
  docs: CustomerCaseRecord[];
  total: number;
}

export interface CreateCaseRequest {
  data: CustomerCaseData;
  idempotencyKey?: string;
}

export interface UpdateCaseRequest {
  data: CustomerCaseData;
  version: number;
}

export interface CaseMutationReceipt {
  operation: 'created' | 'updated';
  record: CustomerCaseRecord;
}

export interface CaseApiError {
  code: string;
  message: string;
  remediation?: string;
  currentVersion?: number;
}

export function isCustomerCaseData(value: unknown): value is CustomerCaseData {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.caseNumber === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    CASE_STATUSES.includes(data.status as CaseStatus) &&
    CASE_PRIORITIES.includes(data.priority as CasePriority) &&
    typeof data.customerName === 'string' &&
    typeof data.ownerName === 'string' &&
    typeof data.updatedAt === 'string'
  );
}

export function isStrictCreateRequest(
  value: unknown,
): value is CreateCaseRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const request = value as Record<string, unknown>;
  const keys = Object.keys(request);
  return (
    keys.every((key) => key === 'data' || key === 'idempotencyKey') &&
    isCustomerCaseData(request.data) &&
    (request.idempotencyKey === undefined ||
      typeof request.idempotencyKey === 'string')
  );
}

export function isStrictUpdateRequest(
  value: unknown,
): value is UpdateCaseRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const request = value as Record<string, unknown>;
  const keys = Object.keys(request);
  return (
    keys.every((key) => key === 'data' || key === 'version') &&
    keys.includes('data') &&
    keys.includes('version') &&
    isCustomerCaseData(request.data) &&
    Number.isInteger(request.version) &&
    Number(request.version) > 0
  );
}
