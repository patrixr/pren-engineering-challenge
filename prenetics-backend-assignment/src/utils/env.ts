export function readEnv(key: string, fallback = ""): string {
  const value = process.env[key];
  return value ? value : fallback;
}

export function readEnvStrict(key: string): string {
  const value = readEnv(key);

  if (!value) {
    throw new Error(`Missing environment variable '${key}'`);
  }

  return value;
}

export function env() {
  return readEnv("NODE_ENV", "dev");
}

export function isTestEnv() {
  return /test/i.test(env());
}
