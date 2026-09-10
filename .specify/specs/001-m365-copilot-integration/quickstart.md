# Planned Quickstart

```bash
git clone https://github.com/eai-support/eai-microsoft-copilot-starter.git
cd eai-microsoft-copilot-starter
npm ci
cp .env.example .env.local
./run.sh dev 3001
```

Synthetic mode must work without platform secrets. Live mode requires an authenticated EAI user, a dedicated development tenant, a provisioned starter app/schema and Microsoft OAuth configuration. No secret or tenant-specific value is committed.

Validation commands:

```bash
npm run verify
npm run test:copilot-contract
npm run validate:m365
npm run test:business-scenarios
```

