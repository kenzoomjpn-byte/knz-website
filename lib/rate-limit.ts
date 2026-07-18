/**
 * フォームAPI用の簡易レートリミッタ(インスタンス内メモリ)。
 * サーバーレスでは完全ではないが、単一インスタンスからの連投スパムを防ぐ。
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) hits.clear(); // メモリ肥大の安全弁
  return recent.length <= limit;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}
