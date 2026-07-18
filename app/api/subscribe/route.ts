import { NextResponse } from "next/server";
import { appendFile, mkdir, stat } from "fs/promises";
import path from "path";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * FANS メルマガ登録。届いた登録は三重に記録する:
 *  1. SHEETS_WEBHOOK_URL(Google Apps Script)があれば Google スプレッドシートへ追記
 *  2. CONTACT_FORWARD_EMAIL へ通知メール(FormSubmit 経由)
 *  3. ローカル data/subscribers.csv へバックアップ追記(git 管理外)
 */

const csvEscape = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function POST(request: Request) {
  if (!rateLimit(`subscribe:${clientIp(request)}`)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // honeypot
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const lastName = String(body.lastName ?? "").trim().slice(0, 60);
  const firstName = String(body.firstName ?? "").trim().slice(0, 60);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const location = String(body.location ?? "").trim().slice(0, 100);

  if (
    !lastName ||
    !firstName ||
    !location ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  ) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  const registeredAt = new Date().toISOString();
  let recorded = false;

  // 1. Google スプレッドシート(Apps Script Webhook)
  const webhook = process.env.SHEETS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registeredAt, lastName, firstName, email, location }),
      });
      if (res.ok) recorded = true;
    } catch {
      // メール/CSV にフォールバック
    }
  }

  // 2. 通知メール
  const to = process.env.CONTACT_FORWARD_EMAIL;
  if (to) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `KNZ FANS 新規登録: ${lastName} ${firstName}`,
          _template: "table",
          lastName,
          firstName,
          email,
          location,
          registeredAt,
        }),
      });
      if (res.ok) recorded = true;
    } catch {
      // CSV にフォールバック
    }
  }

  // 3. ローカル CSV バックアップ(サーバーレス環境では失敗しても無視)
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, "subscribers.csv");
    const exists = await stat(file).then(() => true).catch(() => false);
    const header = "registeredAt,lastName,firstName,email,location\n";
    const line =
      [registeredAt, lastName, firstName, email, location].map(csvEscape).join(",") +
      "\n";
    await appendFile(file, exists ? line : header + line, "utf8");
    recorded = true;
  } catch {
    // read-only filesystem など
  }

  if (!recorded) {
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
