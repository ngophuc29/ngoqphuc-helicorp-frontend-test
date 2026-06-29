import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type NewsletterPayload = {
  email?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const storagePath = path.join(process.cwd(), ".data", "newsletter-submissions.json");

export const runtime = "nodejs";

async function persistSubmission(payload: Record<string, string>) {
  await mkdir(path.dirname(storagePath), { recursive: true });

  const existing: Array<Record<string, string>> = await readFile(storagePath, "utf8")
    .then((content) => JSON.parse(content) as Array<Record<string, string>>)
    .catch(() => [] as Array<Record<string, string>>);

  existing.push(payload);
  await writeFile(storagePath, JSON.stringify(existing, null, 2));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as NewsletterPayload | null;

  if (!body?.email || !emailPattern.test(body.email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const payload = {
    email: body.email.trim().toLowerCase(),
    source: body.source ?? "auraband-landing",
    submittedAt: new Date().toISOString()
  };

  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  try {
    await persistSubmission(payload);
  } catch (error) {
    console.warn("Local storage persistence not available (e.g. serverless environment):", error);
  }

  return NextResponse.json({
    message: "Subscribed. AuraBand X updates are on the way.",
    data: payload
  });
}
