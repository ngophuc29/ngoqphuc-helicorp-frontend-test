import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type CheckoutPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
};

const storagePath = path.join(process.cwd(), ".data", "orders.json");

export const runtime = "nodejs";

async function persistOrder(order: Record<string, unknown>) {
  await mkdir(path.dirname(storagePath), { recursive: true });

  const existing: Array<Record<string, unknown>> = await readFile(storagePath, "utf8")
    .then((content) => JSON.parse(content) as Array<Record<string, unknown>>)
    .catch(() => [] as Array<Record<string, unknown>>);

  existing.push(order);
  await writeFile(storagePath, JSON.stringify(existing, null, 2));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;

  if (!body) {
    return NextResponse.json({ message: "Invalid data." }, { status: 400 });
  }

  const { name, phone, email, address, paymentMethod, items, subtotal } = body;

  if (!name || !phone || !email || !address || !paymentMethod || !items || items.length === 0) {
    return NextResponse.json({ message: "Please fill in all required shipping information." }, { status: 400 });
  }

  const order = {
    id: `order_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    customer: { name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim() },
    paymentMethod,
    items,
    subtotal,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  // Trigger Webhook if configured
  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    try {
      await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "checkout",
          data: order
        })
      });
    } catch (error) {
      console.error("Failed to send webhook:", error);
    }
  }

  // Persist order (safe on Vercel)
  try {
    await persistOrder(order);
  } catch (error) {
    console.warn("Local order persistence not available (e.g. serverless environment):", error);
  }

  return NextResponse.json({
    message: "Order placed successfully! Thank you for shopping at AuraBand X.",
    orderId: order.id,
    data: order
  });
}
