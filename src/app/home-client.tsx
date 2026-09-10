'use client';

import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Check,
  CircleDot,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { GeneratedWorkflowForm } from '@/components/generated-workflow/workflow-form';
import type { GeneratedWorkflowRuntime } from '@/lib/generated-workflow/runtime-contract';
import type {
  CaseListResponse,
  CaseMutationReceipt,
  CaseStatus,
  CustomerCaseData,
  CustomerCaseRecord,
} from '@/lib/cases/contracts';

interface HomeClientProps {
  generatedWorkflow?: Pick<
    GeneratedWorkflowRuntime,
    'appKey' | 'binding' | 'snapshot' | 'branding'
  >;
  runtimeError?: string;
}

export function HomeClient({
  generatedWorkflow,
  runtimeError,
}: HomeClientProps) {
  if (runtimeError) {
    return (
      <main className='flex min-h-svh items-center justify-center bg-slate-50 p-6'>
        <section className='max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm'>
          <h1 className='text-xl font-semibold text-slate-950'>
            Workflow unavailable
          </h1>
          <p className='mt-2 text-sm text-slate-600'>
            The deployed workflow snapshot did not pass its integrity check.
          </p>
        </section>
      </main>
    );
  }
  if (!generatedWorkflow) {
    return <CaseAssistant />;
  }
  return (
    <div
      data-eai-workflow-ready='true'
      data-eai-workflow-digest={
        generatedWorkflow.binding.workflowTemplate.digest
      }
      data-eai-workflow-title={generatedWorkflow.binding.workflowTemplate.title}
    >
      <GeneratedWorkflowForm
        appKey={generatedWorkflow.appKey}
        binding={generatedWorkflow.binding}
        branding={generatedWorkflow.branding}
        snapshot={generatedWorkflow.snapshot}
      />
    </div>
  );
}

const STATUS_LABELS: Record<CaseStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  waiting_on_customer: 'Waiting on customer',
  resolved: 'Resolved',
};

function caseCollectionUrl(): string {
  const live = process.env.NEXT_PUBLIC_EAI_STARTER_DATA_MODE === 'live';
  const tenant = live
    ? process.env.NEXT_PUBLIC_EAI_TENANT_ID
    : process.env.NEXT_PUBLIC_EAI_STARTER_SYNTHETIC_TENANT_ID || 'demo';
  const prefix = live ? '/api/eai' : '';
  return `${prefix}/v4/data/resources/${tenant}/customer-case`;
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    const message =
      body?.error?.message ||
      'The case service could not complete the request.';
    throw new Error(message);
  }
  return body as T;
}

function CaseAssistant() {
  const [cases, setCases] = useState<CustomerCaseRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const selected = cases.find((item) => item.id === selectedId) || cases[0];

  async function loadCases() {
    setLoading(true);
    setError(undefined);
    try {
      const result = await readJson<CaseListResponse>(
        await fetch(`${caseCollectionUrl()}?limit=20`, { cache: 'no-store' }),
      );
      setCases(result.docs);
      setSelectedId((current) =>
        result.docs.some((item) => item.id === current)
          ? current
          : result.docs[0]?.id,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to load cases.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void fetch(`${caseCollectionUrl()}?limit=20`, { cache: 'no-store' })
      .then((response) => readJson<CaseListResponse>(response))
      .then((result) => {
        if (!active) return;
        setCases(result.docs);
        setSelectedId(result.docs[0]?.id);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : 'Unable to load cases.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function createCase() {
    setSaving(true);
    setError(undefined);
    const now = new Date().toISOString();
    const data: CustomerCaseData = {
      caseNumber: `CASE-${2000 + cases.length + 1}`,
      title: 'New service request from Copilot',
      description:
        'A synthetic request created through the canonical PublicAPI V4 contract.',
      status: 'new',
      priority: 'medium',
      customerName: 'Demonstration customer',
      ownerName: 'Unassigned',
      updatedAt: now,
    };
    try {
      const result = await readJson<CaseMutationReceipt>(
        await fetch(caseCollectionUrl(), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ data, idempotencyKey: `web-${now}` }),
        }),
      );
      setCases((current) => [result.record, ...current]);
      setSelectedId(result.record.id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to create the case.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(status: CaseStatus) {
    if (!selected) return;
    setSaving(true);
    setError(undefined);
    try {
      const result = await readJson<CaseMutationReceipt>(
        await fetch(`${caseCollectionUrl()}/${selected.id}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            data: {
              ...selected.data,
              status,
              updatedAt: new Date().toISOString(),
            },
            version: selected.version,
          }),
        }),
      );
      setCases((current) =>
        current.map((item) =>
          item.id === result.record.id ? result.record : item,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to update the case.',
      );
      await loadCases();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className='starter-shell'>
      <header className='starter-header'>
        <a
          className='brand-lockup'
          href='#top'
          aria-label='EAI Case Assistant home'
        >
          <span className='brand-mark'>E</span>
          <span>EAI Case Assistant</span>
        </a>
        <div className='channel-pill'>
          <Bot size={16} /> Microsoft Teams + Copilot ready
        </div>
      </header>

      <section id='top' className='hero-grid'>
        <div className='hero-copy'>
          <p className='eyebrow'>ONE CASE RECORD. EVERY APPROVED CHANNEL.</p>
          <h1>Put governed customer work inside Copilot.</h1>
          <p className='hero-lede'>
            EAI keeps identity, tenant permissions and operational data
            authoritative. Copilot gives each user a familiar place to act on
            it.
          </p>
          <div className='hero-actions'>
            <button
              className='primary-button'
              onClick={createCase}
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle className='spin' size={18} />
              ) : (
                <Plus size={18} />
              )}
              Create demonstration case
            </button>
            <a
              className='text-link'
              href='https://github.com/eai-support/eai-microsoft-copilot-starter'
            >
              View implementation <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className='value-stack' aria-label='Platform value'>
          <article>
            <ShieldCheck />
            <div>
              <strong>External identity</strong>
              <span>
                EAI External ID can securely include customers and partners.
              </span>
            </div>
          </article>
          <article>
            <Users />
            <div>
              <strong>Tenant-safe access</strong>
              <span>
                PublicAPI and Authz apply the same policy in web and Copilot.
              </span>
            </div>
          </article>
          <article>
            <CircleDot />
            <div>
              <strong>One operational record</strong>
              <span>ResourceAPI remains the governed system of record.</span>
            </div>
          </article>
        </div>
      </section>

      <section className='workspace-section'>
        <div className='section-heading'>
          <div>
            <p className='eyebrow'>WORKING JOURNEY</p>
            <h2>Customer case workspace</h2>
          </div>
          <span className='mode-badge'>
            {process.env.NEXT_PUBLIC_EAI_STARTER_DATA_MODE === 'live'
              ? 'EAI live mode'
              : 'Synthetic safe mode'}
          </span>
        </div>

        {error && (
          <p role='alert' className='error-banner'>
            {error}
          </p>
        )}
        <div className='case-workspace'>
          <div className='case-list' aria-label='Customer cases'>
            {loading ? (
              <p className='empty-state'>Loading governed cases...</p>
            ) : (
              cases.map((item) => (
                <button
                  key={item.id}
                  className={`case-row ${selected?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <span
                    className={`priority-dot priority-${item.data.priority}`}
                  />
                  <span className='case-row-copy'>
                    <strong>{item.data.title}</strong>
                    <small>
                      {item.data.caseNumber} · {item.data.customerName}
                    </small>
                  </span>
                  <span className='status-label'>
                    {STATUS_LABELS[item.data.status]}
                  </span>
                </button>
              ))
            )}
          </div>

          <article className='case-detail'>
            {selected ? (
              <>
                <div className='detail-meta'>
                  <span>{selected.data.caseNumber}</span>
                  <span>Version {selected.version}</span>
                </div>
                <h3>{selected.data.title}</h3>
                <p>{selected.data.description}</p>
                <dl>
                  <div>
                    <dt>Customer</dt>
                    <dd>{selected.data.customerName}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>{selected.data.ownerName}</dd>
                  </div>
                  <div>
                    <dt>Priority</dt>
                    <dd>{selected.data.priority}</dd>
                  </div>
                </dl>
                <label htmlFor='case-status'>Update status</label>
                <select
                  id='case-status'
                  value={selected.data.status}
                  disabled={saving}
                  onChange={(event) =>
                    void updateStatus(event.target.value as CaseStatus)
                  }
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className='contract-note'>
                  <Check size={15} /> PUT with {'{ data, version }'} prevents
                  lost updates.
                </p>
              </>
            ) : (
              <p className='empty-state'>
                Select a case to see its governed record.
              </p>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
