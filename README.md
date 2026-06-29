# HelioPure Air Landing Page

Landing page Next.js cho bai test Helicorp vong 2. Project tap trung vao SEO technical, performance mobile, responsive UI va cac diem cong de demo.

## Stack

- Next.js App Router + TypeScript
- CSS thuan, khong dung UI library nang
- API Route `/api/newsletter` validate form va gui webhook neu cau hinh `NEWSLETTER_WEBHOOK_URL`
- `next/image` cho hero asset de toi uu anh

## Tinh nang dap ung de bai

- Hero Section, tinh nang noi bat, thong so ky thuat, form dang ky nhan tin
- Meta title, description, Open Graph, Twitter card
- Responsive desktop/mobile
- Dark Mode
- Scroll animation va micro-interactions
- Tracking click/scroll bang toast notification
- Mini commerce: yeu thich, gio hang, san pham da xem qua `localStorage`
- Chatbot local o goc man hinh voi cau tra loi nhanh
- Webhook-ready backend route

## Chay local

```bash
npm install
npm run dev
```

Mo `http://localhost:3000`.

## Cau hinh webhook demo

Tao file `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEWSLETTER_WEBHOOK_URL=https://webhook.site/your-demo-url
```

Neu khong co webhook, form van validate va tra ve thong bao thanh cong.

## Deploy

Khuyen nghi Vercel:

1. Push repository public len GitHub.
2. Import project vao Vercel.
3. Them environment variables neu can.
4. Deploy va chup PageSpeed Insights Mobile.

## Checklist nop bai

- Link GitHub repository public
- Link landing page da deploy
- Anh chup diem Google PageSpeed Insights
- Minh chung diem cong: dark mode, chatbot, mini commerce, webhook, tracking click/scroll
