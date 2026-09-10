# Risk Heatmap

| Risk | Likelihood | Impact | Control |
| --- | --- | --- | --- |
| Cross-tenant access | Low | Critical | server-fixed tenant, user OAuth and Authz |
| Incorrect mutation overwrite | Low | High | strict PUT, current version and conflict test |
| Secret or tenant ID commit | Low | High | ignored runtime files and regression test |
| Synthetic evidence mistaken for live | Low | High | four separate evidence states |
| Microsoft development dependency CVEs | Medium | Medium | dev-only pin and zero-vulnerability production audit |
| Customer rollout without approval | Low | High | PR-only scope and organization-admin gate |
