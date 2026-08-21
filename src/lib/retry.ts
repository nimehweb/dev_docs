function isNetworkError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const msg = String((err as { message?: unknown }).message ?? "");
  const code = String((err as { code?: unknown }).code ?? "");
  const causeMsg = String(
    (err as { cause?: { message?: unknown; code?: unknown } }).cause?.message ?? "",
  );
  const causeCode = String(
    (err as { cause?: { message?: unknown; code?: unknown } }).cause?.code ?? "",
  );

  return (
    msg.includes("EAI_AGAIN") ||
    msg.includes("getaddrinfo") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    code.includes("EAI_AGAIN") ||
    causeMsg.includes("EAI_AGAIN") ||
    causeMsg.includes("getaddrinfo") ||
    causeCode.includes("EAI_AGAIN")
  );
}

export async function withDbRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isNetworkError(err) || attempt === maxRetries) {
        throw err;
      }
      await new Promise((res) => setTimeout(res, 350 * attempt));
    }
  }
  throw lastError;
}
