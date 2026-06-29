import { NextResponse } from "next/server";

type NewsletterPayload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(\+?84|0)(3|5|7|8|9)\d{8}$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as NewsletterPayload | null;

  if (!body?.name || body.name.trim().length < 2) {
    return NextResponse.json({ message: "Ten can toi thieu 2 ky tu." }, { status: 400 });
  }

  if (!body.email || !emailPattern.test(body.email)) {
    return NextResponse.json({ message: "Email chua hop le." }, { status: 400 });
  }

  if (body.phone && !phonePattern.test(body.phone.replace(/\s/g, ""))) {
    return NextResponse.json({ message: "So dien thoai Viet Nam chua hop le." }, { status: 400 });
  }

  const payload = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone?.trim() ?? "",
    interest: body.interest ?? "product-news",
    source: body.source ?? "landing-page",
    submittedAt: new Date().toISOString()
  };

  if (process.env.NEWSLETTER_WEBHOOK_URL) {
    await fetch(process.env.NEWSLETTER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  return NextResponse.json({
    message: "Dang ky thanh cong. Team se gui ban thong tin san pham som nhat.",
    data: payload
  });
}
