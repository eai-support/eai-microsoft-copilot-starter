const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((filename) => JSON.stringify(filename)).join(' ')}`;

const lintStagedConfig = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
};

export default lintStagedConfig;
