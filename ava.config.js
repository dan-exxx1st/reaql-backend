const config = {
  files: ['!node_modules', '!ormlogs.log'],
  concurrency: 4,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  extensions: ['ts'],
  require: ['ts-node/register'],
  environmentVariables: {
    NODE_PATH: './packages',
  },
};

export default config;
