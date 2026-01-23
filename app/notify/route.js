import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;
const rateBucket = new Map();

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const entry = rateBucket.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateBucket.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip");

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload = null;
  try {
    payload = await request.json();
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // TODO: vérifier la signature Orange Money quand les headers exacts sont connus.
  console.log("[notify] Orange Money webhook", {
    ip,
    payload,
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "notify endpoint" });
}
