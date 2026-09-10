import { render, screen } from '@testing-library/react';

import { HomeClient } from './home-client';

jest.mock('@/components/generated-workflow/workflow-form', () => ({
  GeneratedWorkflowForm: ({
    branding,
  }: {
    branding?: { displayName?: string };
  }) => <div>{branding?.displayName ?? 'Generated workflow form'}</div>,
}));

describe('HomeClient generated workflow runtime', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ docs: [], total: 0 }),
    });
  });

  it('exposes semantic workflow markers on the rendered root', () => {
    const { container } = render(
      <HomeClient
        generatedWorkflow={{
          appKey: 'rates-review',
          binding: {
            schemaVersion: 'eai.generated_app_runtime_binding.v1',
            workflowTemplate: {
              id: 'template-123',
              version: 2,
              digest: `sha256:${'a'.repeat(64)}`,
              title: 'Rates Review',
            },
            respondentAccess: {
              mode: 'anonymous',
              submissionObjectType: 'workflow-submission',
              fileObjectType: 'submission-file',
            },
          },
          branding: { displayName: 'Acme Council' },
          snapshot: { steps: [{ id: 'one', title: 'One', fields: [] }] },
        }}
      />,
    );

    const marker = container.querySelector('[data-eai-workflow-ready="true"]');
    expect(marker).toHaveAttribute(
      'data-eai-workflow-digest',
      `sha256:${'a'.repeat(64)}`,
    );
    expect(marker).toHaveAttribute('data-eai-workflow-title', 'Rates Review');
    expect(screen.getByText('Acme Council')).toBeVisible();
  });

  it('renders the case assistant when no generated runtime is exported', async () => {
    render(<HomeClient />);

    expect(
      screen.getByRole('heading', {
        name: 'Put governed customer work inside Copilot.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Customer case workspace' }),
    ).toBeVisible();
    expect(
      await screen.findByText('Select a case to see its governed record.'),
    ).toBeVisible();
  });
});
