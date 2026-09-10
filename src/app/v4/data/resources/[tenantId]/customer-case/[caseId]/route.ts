import { demoCaseStore } from '@/lib/cases/demo-store';
import { isStrictUpdateRequest } from '@/lib/cases/contracts';
import { apiError, guardSyntheticRequest } from '@/lib/cases/http';

interface RouteContext {
  params: Promise<{ tenantId: string; caseId: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<Response> {
  const { tenantId, caseId } = await context.params;
  const denied = guardSyntheticRequest(tenantId);
  if (denied) return denied;

  const record = demoCaseStore.get(caseId);
  if (!record) {
    return apiError(404, {
      code: 'CASE_NOT_FOUND',
      message: 'The requested customer case does not exist.',
    });
  }
  return Response.json(record);
}

export async function PUT(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { tenantId, caseId } = await context.params;
  const denied = guardSyntheticRequest(tenantId);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = undefined;
  }
  if (!isStrictUpdateRequest(body)) {
    return apiError(422, {
      code: 'INVALID_V4_RESOURCE_UPDATE_BODY',
      message:
        'Resource update requires PUT with a strict { data, version } body.',
      remediation:
        'Read the latest record, then send its full data and current version.',
    });
  }

  const result = demoCaseStore.update(caseId, body.data, body.version);
  if (!result) {
    return apiError(404, {
      code: 'CASE_NOT_FOUND',
      message: 'The requested customer case does not exist.',
    });
  }
  if ('conflict' in result) {
    return apiError(409, {
      code: 'STALE_RESOURCE_VERSION',
      message: 'The case changed after it was read.',
      remediation: 'Read the case again and retry with its latest version.',
      currentVersion: result.conflict,
    });
  }
  return Response.json(result);
}

export async function PATCH(): Promise<Response> {
  return apiError(405, {
    code: 'INVALID_V4_RESOURCE_UPDATE_METHOD',
    message: 'PublicAPI V4 resource updates use PUT, not PATCH.',
    remediation: 'Send PUT with { data, version }.',
  });
}
