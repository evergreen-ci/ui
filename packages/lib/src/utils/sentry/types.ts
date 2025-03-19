import type { Context, Primitive, SeverityLevel } from "@sentry/core";

export type ErrorInput = {
  err: Error;
  fingerprint?: string[];
  context?: Context;
  severity: SeverityLevel;
  tags?: { [key: string]: Primitive };
};

// The "type" field for Sentry breadcrumbs is just "string", but we can approximate the types listed here:
// https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
export enum SentryBreadcrumb {
  Default = "default",
  Debug = "debug",
  Error = "error",
  Navigation = "navigation",
  HTTP = "http",
  Info = "info",
  Query = "query",
  Transaction = "transaction",
  UI = "ui",
  User = "user",
}
