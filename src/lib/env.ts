function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }

  return value;
}

export function getDatabaseUrl() {
  return requireEnv("DATABASE_URL");
}

export function getAdminPassword() {
  return requireEnv("ADMIN_PASSWORD");
}

export function getAdminSessionSecret() {
  return requireEnv("ADMIN_SESSION_SECRET");
}

export function isProductionEnv() {
  return process.env.NODE_ENV === "production";
}
