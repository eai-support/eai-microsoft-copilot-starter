import type { CaseApiError } from './contracts';

export function syntheticTenantId(): string {
  return process.env.EAI_STARTER_SYNTHETIC_TENANT_ID || 'demo';
}

export function syntheticModeEnabled(): boolean {
  return process.env.EAI_STARTER_DATA_MODE === 'synthetic';
}

export function apiError(status: number, error: CaseApiError): Response {
  return Response.json({ error }, { status });
}

export function guardSyntheticRequest(tenantId: string): Response | undefined {
  if (!syntheticModeEnabled()) {
    return apiError(404, {
      code: 'SYNTHETIC_API_DISABLED',
      message: 'The synthetic case API is disabled.',
      remediation: 'Use the EAI PublicAPI V4 endpoint in live mode.',
    });
  }
  if (tenantId !== syntheticTenantId()) {
    return apiError(403, {
      code: 'TENANT_SCOPE_REJECTED',
      message: 'The requested tenant is outside this synthetic demo scope.',
      remediation: `Use the configured synthetic tenant '${syntheticTenantId()}'.`,
    });
  }
  return undefined;
}
