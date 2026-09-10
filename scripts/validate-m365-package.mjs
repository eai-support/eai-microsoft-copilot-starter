import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packagePath = resolve('appPackage/build/appPackage.validation.zip');
if (!existsSync(packagePath)) {
  throw new Error(`Microsoft package was not created: ${packagePath}`);
}

const entries = execFileSync('unzip', ['-Z1', packagePath], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);
const expected = [
  'ai-plugin.json',
  'apiSpecificationFile/eai-cases.openapi.yml',
  'color.png',
  'eaiCaseAssistant.json',
  'manifest.json',
  'outline.png',
];

for (const entry of expected) {
  if (!entries.includes(entry))
    throw new Error(`Microsoft package is missing ${entry}`);
}
if (
  entries.some(
    (entry) => entry.includes('.env') || entry.includes('node_modules'),
  )
) {
  throw new Error(
    'Microsoft package contains environment or dependency files.',
  );
}

const packagedAgent = execFileSync(
  'unzip',
  ['-p', packagePath, 'eaiCaseAssistant.json'],
  {
    encoding: 'utf8',
  },
);
if (
  !packagedAgent.includes('always send the latest version returned by getCase')
) {
  throw new Error(
    'Agents Toolkit did not inline the stale-version safety instruction.',
  );
}
for (const entry of entries.filter((item) => /\.(json|ya?ml)$/.test(item))) {
  const content = execFileSync('unzip', ['-p', packagePath, entry], {
    encoding: 'utf8',
  });
  if (content.includes('${{'))
    throw new Error(`Unresolved environment value in ${entry}.`);
}

const openApi = readFileSync(
  'appPackage/apiSpecificationFile/eai-cases.openapi.yml',
  'utf8',
);
for (const required of [
  'operationId: listMyCases',
  'operationId: getCase',
  'operationId: createCase',
  'operationId: updateCase',
  'x-openai-isConsequential: true',
  'required: [data, version]',
]) {
  if (!openApi.includes(required))
    throw new Error(`OpenAPI contract is missing: ${required}`);
}
if (/\bpatch:/i.test(openApi))
  throw new Error('PublicAPI V4 resource updates must not use PATCH.');

console.log(
  `Microsoft package contains ${entries.length} approved files and four strict V4 operations.`,
);
