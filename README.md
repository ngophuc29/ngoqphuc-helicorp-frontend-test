# AuraBand X Landing Page

Landing page Next.js cho bai test Helicorp vong 2, thiet ke theo concept AuraBand X trong mockup: premium wearable, clean UI, spacing lon, card sang va accent teal.

## Stack

- Next.js App Router + TypeScript
- CSS thuan theo design tokens AuraBand X
- API Route `/api/newsletter` validate email va gui webhook neu cau hinh `NEWSLETTER_WEBHOOK_URL`
- `next/image` cho hero, technical diagram va lifestyle cards

## Tinh nang dap ung de bai

- Hero Section
- Feature cards
- Technical specifications
- Newsletter form
- Meta title, description, Open Graph, Twitter card
- Responsive desktop/mobile
- Scroll animation va micro-interactions
- Skeleton loading cho hero image
- Parallax/scrollytelling section sau Hero
- Dark Mode co luu trang thai bang `localStorage`
- Tracking click/scroll bang toast notification
- Mini commerce: save/favorite, cart quantity, viewed products qua `localStorage`
- Chatbot support nho o goc man hinh
- Webhook-ready backend route
- Backend luu submission vao `.data/newsletter-submissions.json` khi chay Node/server local

## Diem cong da lam

- Validate email truoc khi gui len `/api/newsletter`
- Gui du lieu den webhook that neu co `NEWSLETTER_WEBHOOK_URL`
- Hien thi thong bao khi user click CTA, scroll qua Hero, submit form, them gio hang
- Dark Mode toggle tren navbar
- Scroll animation, skeleton loading, micro-interactions va parallax story cards
- Backend route xu ly va luu submission dang JSON
- Mini commerce luu favorite/cart/viewed product
- Chatbot goc man hinh tra loi nhanh theo nut goi y

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
- Minh chung diem cong: webhook, tracking click/scroll, chatbot, animation
