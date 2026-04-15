export type Result<T> = { ok: true; value: T } | { ok: false; error: Error }

export async function runCatching<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
  }
}
