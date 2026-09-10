#!/usr/bin/env node

import { chmod, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=');
        return [
          line.slice(0, separator).trim(),
          line
            .slice(separator + 1)
            .trim()
            .replace(/^(['"])(.*)\1$/, '$2'),
        ];
      }),
  );
}

function requireValue(env, key) {
  const value = env[key]?.trim();
  if (!value) throw new Error(`${key} is missing from .env.local`);
  return value;
}

async function readEnv(path) {
  try {
    return parseEnv(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

const localEnv = parseEnv(await readFile(join(root, '.env.local'), 'utf8'));
const toolkitEnvPath = join(root, 'env', '.env.dev');
const toolkitEnv = await readEnv(toolkitEnvPath);
const destination = join(root, 'env', '.env.dev.user');
const existingUserEnv = await readEnv(destination);
const tenantName = requireValue(localEnv, 'ENTRA_TENANT_NAME');
const scopes = requireValue(localEnv, 'ENTRA_SCOPES').split(/\s+/);
const publicApiScope = scopes.find((scope) => scope.startsWith('api://'));
if (!publicApiScope) {
  throw new Error('ENTRA_SCOPES does not contain a PublicAPI api:// scope');
}

const authority = `https://${tenantName}.ciamlogin.com/${tenantName}.onmicrosoft.com/oauth2/v2.0`;
const generatedToolkitKeys = [
  'TEAMS_APP_ID',
  'TEAMS_APP_TENANT_ID',
  'OAUTH2AUTHCODE_CONFIGURATION_ID',
  'M365_TITLE_ID',
  'M365_APP_ID',
  'SHARE_LINK',
];
const generatedToolkitSettings = generatedToolkitKeys
  .map((key) => [
    key,
    toolkitEnv[key]?.trim() || existingUserEnv[key]?.trim(),
  ])
  .filter(([, value]) => value)
  .map(([key, value]) => `${key}=${value}`);
if (!toolkitEnv.TEAMSFX_ENV) {
  await writeFile(
    toolkitEnvPath,
    [
      'TEAMSFX_ENV=dev',
      'APP_NAME_SUFFIX=dev',
      'AGENT_SCOPE=personal',
      '',
    ].join('\n'),
    'utf8',
  );
}
const output = [
  'TEAMSFX_ENV=dev',
  ...generatedToolkitSettings,
  `EAI_PUBLIC_API_URL=${requireValue(localEnv, 'BASE_URL_PUBLIC_API')}`,
  `EAI_TENANT_ID=${requireValue(localEnv, 'EAI_TENANT_ID')}`,
  `EAI_AUTHORIZATION_URL=${authority}/authorize`,
  `EAI_TOKEN_URL=${authority}/token`,
  `EAI_OAUTH_SCOPE=${publicApiScope}`,
  `EAI_OAUTH_CLIENT_ID=${requireValue(localEnv, 'ENTRA_CLIENT_ID')}`,
  `SECRET_EAI_OAUTH_CLIENT_SECRET=${requireValue(localEnv, 'ENTRA_CLIENT_SECRET')}`,
  '',
].join('\n');

await writeFile(destination, output, { encoding: 'utf8', mode: 0o600 });
await chmod(destination, 0o600);
console.log(
  'Microsoft development OAuth settings written to env/.env.dev.user.',
);
