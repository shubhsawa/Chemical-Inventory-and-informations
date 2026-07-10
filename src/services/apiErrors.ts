import axios from "axios";

export type ApiErrorKind = "not_found" | "rate_limited" | "network" | "server" | "unknown";

export interface ClassifiedError {
  kind: ApiErrorKind;
  status: number | null;
  message: string;
}

/**
 * Classify an axios/unknown error into a stable kind so callers can decide
 * whether to retry, fall back, or surface a message to the user.
 */
export function classifyError(err: unknown, source: string): ClassifiedError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? null;
    if (status === 404) {
      return { kind: "not_found", status, message: `[${source}] No match (HTTP 404).` };
    }
    if (status === 429) {
      return { kind: "rate_limited", status, message: `[${source}] Rate limited (HTTP 429). Backing off.` };
    }
    if (status && status >= 500) {
      return { kind: "server", status, message: `[${source}] Server error (HTTP ${status}).` };
    }
    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return { kind: "network", status, message: `[${source}] Request timed out.` };
    }
    if (err.request && !err.response) {
      return { kind: "network", status, message: `[${source}] Network unreachable: ${err.message}.` };
    }
    return { kind: "unknown", status, message: `[${source}] HTTP ${status || "?"}: ${err.message}.` };
  }
  return {
    kind: "unknown",
    status: null,
    message: `[${source}] Unexpected error: ${err instanceof Error ? err.message : String(err)}.`,
  };
}

/**
 * Log a classified API error to the console with a clear, scannable prefix.
 * Centralized so every service emits consistent, debuggable output.
 */
export function logApiError(source: string, err: unknown, context?: string): ClassifiedError {
  const classified = classifyError(err, source);
  const ctx = context ? ` (${context})` : "";
  // Use console.warn for expected "no match" 404s, console.error for real failures.
  if (classified.kind === "not_found") {
    console.warn(`${classified.message}${ctx}`);
  } else {
    console.error(`${classified.message}${ctx}`, err instanceof Error ? err.stack ?? "" : "");
  }
  return classified;
}
