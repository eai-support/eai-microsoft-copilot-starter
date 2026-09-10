import { demoCaseStore } from '@/lib/cases/demo-store';
import {
  isStrictCreateRequest,
  type CaseApiError,
} from '@/lib/cases/contracts';
import { apiError, guardSyntheticRequest } from '@/lib/cases/http';

interface RouteContext {
  params: Promise<{ tenantId: string }>;
}

function invalidCreateBody(): Response {
  const error: CaseApiError = {
    code: 'INVALID_V4_RESOURCE_CREATE_BODY',
    message:
      'Resource create requires a strict { data, idempotencyKey? } body.',
    remediation: 'Wrap the complete CustomerCase fields in the data property.',
  };
  return apiError(422, error);
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { tenantId } = await context.params;
  const denied = guardSyntheticRequest(tenantId);
  if (denied) return denied;

  const requestedLimit = Number(
    new URL(request.url).searchParams.get('limit') || 20,
  );
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 50)
    : 20;
  return Response.json(demoCaseStore.list(limit));
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { tenantId } = await context.params;
  const denied = guardSyntheticRequest(tenantId);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidCreateBody();
  }
  if (!isStrictCreateRequest(body)) return invalidCreateBody();

  return Response.json(demoCaseStore.create(body.data, body.idempotencyKey), {
    status: 201,
  });
}
