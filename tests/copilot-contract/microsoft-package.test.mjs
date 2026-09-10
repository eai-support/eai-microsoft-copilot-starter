import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pluginPath = new URL('../../appPackage/ai-plugin.json', import.meta.url);
const openApiPath = new URL(
  '../../appPackage/apiSpecificationFile/eai-cases.openapi.yml',
  import.meta.url,
);
const workflowPath = new URL('../../m365agents.yml', import.meta.url);
const gitignorePath = new URL('../../.gitignore', import.meta.url);
const configurePath = new URL(
  '../../scripts/configure-m365-dev.mjs',
  import.meta.url,
);

test('Microsoft plugin exposes only the four approved case operations', async () => {
  const plugin = JSON.parse(await readFile(pluginPath, 'utf8'));
  assert.deepEqual(
    plugin.functions.map((item) => item.name),
    ['listMyCases', 'getCase', 'createCase', 'updateCase'],
  );
  assert.equal(plugin.runtimes[0].auth.type, 'OAuthPluginVault');
  assert.deepEqual(
    plugin.runtimes[0].run_for_functions,
    plugin.functions.map((item) => item.name),
  );
});

test('mutations require confirmation and the strict V4 method/body contract', async () => {
  const plugin = JSON.parse(await readFile(pluginPath, 'utf8'));
  for (const operation of plugin.functions.slice(2)) {
    assert.equal(operation.capabilities.confirmation.type, 'AdaptiveCard');
  }

  const openApi = await readFile(openApiPath, 'utf8');
  assert.doesNotMatch(openApi, /\bpatch:/i);
  assert.match(openApi, /\n    put:\n/);
  assert.match(openApi, /required: \[data, version\]/);
  assert.match(openApi, /x-openai-isConsequential: true/);
});

test('OAuth registration uses the OpenAPI security scheme identifier', async () => {
  const [openApi, workflow] = await Promise.all([
    readFile(openApiPath, 'utf8'),
    readFile(workflowPath, 'utf8'),
  ]);
  assert.match(openApi, /securitySchemes:\s*\n\s+eaiExternalId:/);
  assert.match(workflow, /uses: oauth\/register[\s\S]*?name: eaiExternalId/);
});

test('live Microsoft identifiers and EAI secrets stay in ignored local files', async () => {
  const [gitignore, configure] = await Promise.all([
    readFile(gitignorePath, 'utf8'),
    readFile(configurePath, 'utf8'),
  ]);

  assert.match(gitignore, /^\.env\*$/m);
  assert.doesNotMatch(gitignore, /!\/env\/\.env\.dev$/m);
  assert.match(gitignore, /!\/env\/\.env\.dev\.example/);
  assert.match(gitignore, /\/env\/\*\.user/);
  assert.match(configure, /SECRET_EAI_OAUTH_CLIENT_SECRET/);
  assert.match(configure, /generatedToolkitKeys/);
  assert.match(configure, /mode: 0o600/);
});
