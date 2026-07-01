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

  const userEmail = body.email.trim().toLowerCase();
  const payload = {
    email: userEmail,
    source: body.source ?? "auraband-landing",
    submittedAt: new Date().toISOString()
  };

  // Submit to Web3Forms to trigger a real email notification
  const web3AccessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3AccessKey) {
    try {
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: web3AccessKey,
          subject: "New Newsletter Subscriber - AuraBand X",
          from_name: "AuraBand X System",
          email: userEmail,
          message: `Congratulations! A new user has subscribed to the AuraBand X newsletter.\n\nEmail Address: ${userEmail}\nSource: ${payload.source}\nDate/Time: ${payload.submittedAt}`
        })
      });

      if (!web3Response.ok) {
        console.error("Web3Forms API error status:", web3Response.status);
      }
    } catch (error) {
      console.error("Failed to forward submission to Web3Forms:", error);
    }
  } else {
    console.warn("WEB3FORMS_ACCESS_KEY is not configured in .env");
  }

  // Trigger optional webhook if configured
  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    try {
      await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Failed to trigger webhook:", e);
    }
  }

  // Local storage backup
  try {
    await persistSubmission(payload);
  } catch (error) {
    console.warn("Local storage persistence not available:", error);
  }

  return NextResponse.json({
    message: "Subscribed. AuraBand X updates are on the way.",
    data: payload
  });
}
