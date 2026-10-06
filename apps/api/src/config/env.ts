const environments = ['development', 'test', 'production'] as const;

type NodeEnvironment = (typeof environments)[number];

export interface RuntimeConfig {
  nodeEnv: NodeEnvironment;
  port: number;
}

function isNodeEnvironment(value: string): value is NodeEnvironment {
  return environments.some((environment) => environment === value);
}

function parseNodeEnvironment(value: string | undefined): NodeEnvironment {
  const nodeEnv = value ?? 'development';

  if (!isNodeEnvironment(nodeEnv)) {
    throw new Error('NODE_ENV debe ser development, test o production.');
  }

  return nodeEnv;
}

function parsePort(value: string | undefined): number {
  const rawPort = value ?? '4000';

  if (!/^\d+$/.test(rawPort)) {
    throw new Error('API_PORT debe ser un número entero entre 1 y 65535.');
  }

  const port = Number(rawPort);

  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error('API_PORT debe ser un número entero entre 1 y 65535.');
  }

  return port;
}

export function loadRuntimeConfig(environment: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  return {
    nodeEnv: parseNodeEnvironment(environment.NODE_ENV),
    port: parsePort(environment.API_PORT),
  };
}
