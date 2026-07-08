import { NextResponse } from "next/server";

/**
 * 問い合わせフォームの送信先。宛先アドレスはサーバー側の環境変数にのみ
 * 存在し、クライアントには一切露出しない。転送は FormSubmit
 * (https://formsubmit.co) の AJAX エンドポイント経由。
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // honeypot: bots fill every field — pretend success and drop it
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  const to = process.env.CONTACT_FORWARD_EMAIL;
  if (!to) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `KNZ サイトからの問い合わせ: ${name}`,
        _replyto: email,
        _template: "table",
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "delivery failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delivery failed" }, { status: 502 });
  }
}
