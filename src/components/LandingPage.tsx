"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatVnd, product } from "@/lib/product";

type Toast = {
  text: string;
  tone: "success" | "error" | "info";
};

type CartState = {
  liked: boolean;
  quantity: number;
  viewed: string[];
};

const quickReplies = [
  "May co phu hop phong ngu khong?",
  "Bao lau thay mang loc?",
  "Co ket noi mobile app khong?"
];

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [cart, setCart] = useState<CartState>({ liked: false, quantity: 0, viewed: [] });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: "bot",
      text: "Chao ban, minh co the tu van nhanh ve HelioPure Air."
    }
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem("heliopure-cart");
      setCart(stored ? (JSON.parse(stored) as CartState) : { liked: false, quantity: 0, viewed: [product.name] });
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("heliopure-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let tracked = false;
    const onScroll = () => {
      if (!tracked && window.scrollY > window.innerHeight * 0.55) {
        tracked = true;
        setToast({ text: "Da ghi nhan hanh vi scroll qua Hero Section.", tone: "info" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartTotal = useMemo(() => product.price * cart.quantity, [cart.quantity]);

  const showToast = (toastValue: Toast) => {
    setToast(toastValue);
    window.setTimeout(() => setToast(null), 3200);
  };

  const trackClick = (label: string) => {
    showToast({ text: `Da ghi nhan click: ${label}.`, tone: "info" });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("loading");

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = (await response.json()) as { message: string };
    setFormStatus(response.ok ? "success" : "error");
    showToast({ text: result.message, tone: response.ok ? "success" : "error" });

    if (response.ok) {
      event.currentTarget.reset();
    }
  };

  const sendChat = (question: string) => {
    const answer = question.toLowerCase().includes("mang loc")
      ? "Mang loc HEPA H13 + Carbon thuong dung 8-12 thang, he thong se nhac dua tren muc dung thuc te."
      : question.toLowerCase().includes("app")
        ? "Co. Thiet bi ket noi Wi-Fi va dong bo dashboard, canh bao chat luong khong khi qua mobile app."
        : "Co, che do Quiet Night Flow giu do on 18 dB nen phu hop phong ngu va phong em be.";

    setChatLog((current) => [
      ...current,
      { role: "user", text: question },
      { role: "bot", text: answer }
    ]);
  };

  return (
    <main className={dark ? "site dark" : "site"}>
      <header className="topbar">
        <a className="brand" href="#hero" aria-label="HelioPure home">
          <span className="brandMark">H</span>
          <span>HelioPure</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#features">Tinh nang</a>
          <a href="#specs">Thong so</a>
          <a href="#commerce">Gio hang</a>
          <a href="#signup">Dang ky</a>
        </nav>
        <button className="iconButton" type="button" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
          {dark ? "☀" : "◐"}
        </button>
      </header>

      <section className="hero" id="hero">
        <div className="heroCopy reveal">
          <p className="eyebrow">Smart wellness air hub</p>
          <h1>{product.name}</h1>
          <p className="lead">{product.tagline}</p>
          <p className="sublead">{product.description}</p>
          <div className="heroActions">
            <a className="primaryButton" href="#signup" onClick={() => trackClick("CTA nhan tin")}>
              Nhan thong tin som
            </a>
            <button
              className="secondaryButton"
              type="button"
              onClick={() => {
                setCart((current) => ({ ...current, quantity: current.quantity + 1 }));
                trackClick("Them vao gio hang");
              }}
            >
              Them vao gio
            </button>
          </div>
          <div className="metricRow" aria-label="Product highlights">
            <span><strong>420</strong> m3/h CADR</span>
            <span><strong>18dB</strong> sleep mode</span>
            <span><strong>65m2</strong> coverage</span>
          </div>
        </div>
        <div className="heroVisual reveal">
          <Image
            src="/images/heliopure-hero.png"
            alt="HelioPure Air smart air quality hub in a modern healthy home"
            width={1200}
            height={900}
            priority
            sizes="(max-width: 768px) 94vw, 48vw"
          />
        </div>
      </section>

      <section className="storyBand" aria-label="Air quality story">
        <div className="storyStep reveal">
          <span>01</span>
          <h2>Phat hien nhanh</h2>
          <p>Sensor PM2.5, VOC va CO2 cap nhat lien tuc de phat hien thay doi chat luong khong khi.</p>
        </div>
        <div className="storyStep reveal">
          <span>02</span>
          <h2>Xu ly tu dong</h2>
          <p>AI Auto Balance dieu tiet luong gio, giam on va tiet kiem nang luong khi khong can chay manh.</p>
        </div>
        <div className="storyStep reveal">
          <span>03</span>
          <h2>Song de tho hon</h2>
          <p>Dashboard gom y nghia cac chi so thanh mot diem suc khoe de ca nha de hieu va hanh dong.</p>
        </div>
      </section>

      <section className="section" id="features">
        <div className="sectionHeader reveal">
          <p className="eyebrow">Tinh nang noi bat</p>
          <h2>Du thong minh de tu dong, du ro rang de tin tuong.</h2>
        </div>
        <div className="featureGrid">
          {product.features.map((feature, index) => (
            <article className="featureCard reveal" key={feature.title}>
              <span className="featureIcon">{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section specs" id="specs">
        <div className="sectionHeader reveal">
          <p className="eyebrow">Thong so ky thuat</p>
          <h2>Thong tin ro rang cho nguoi mua can so sanh.</h2>
        </div>
        <div className="specGrid reveal">
          {product.specs.map(([label, value]) => (
            <div className="specItem" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="commerce section" id="commerce">
        <div className="sectionHeader reveal">
          <p className="eyebrow">Mini commerce</p>
          <h2>Luu san pham, gio hang va san pham da xem.</h2>
        </div>
        <div className="commerceShell reveal">
          <div>
            <p className="productName">{product.name}</p>
            <p className="price">{formatVnd(product.price)}</p>
            <p className="muted">Da xem: {cart.viewed.join(", ") || product.name}</p>
          </div>
          <div className="commerceActions">
            <button
              className={cart.liked ? "pill active" : "pill"}
              type="button"
              onClick={() => setCart((current) => ({ ...current, liked: !current.liked }))}
            >
              {cart.liked ? "Da yeu thich" : "Yeu thich"}
            </button>
            <button className="pill" type="button" onClick={() => setCart((current) => ({ ...current, quantity: Math.max(0, current.quantity - 1) }))}>
              -
            </button>
            <span className="quantity">{cart.quantity}</span>
            <button className="pill" type="button" onClick={() => setCart((current) => ({ ...current, quantity: current.quantity + 1 }))}>
              +
            </button>
          </div>
          <strong className="total">Tam tinh: {formatVnd(cartTotal)}</strong>
        </div>
      </section>

      <section className="signup section" id="signup">
        <div className="sectionHeader reveal">
          <p className="eyebrow">Dang ky nhan tin</p>
          <h2>Ket noi webhook, validate du lieu va phan hoi tuc thi.</h2>
        </div>
        <form className="signupForm reveal" onSubmit={onSubmit}>
          <label>
            Ho ten
            <input name="name" minLength={2} required placeholder="Nguyen Van A" />
          </label>
          <label>
            Email
            <input name="email" type="email" required placeholder="email@example.com" />
          </label>
          <label>
            Dien thoai
            <input name="phone" inputMode="tel" placeholder="0912345678" />
          </label>
          <label>
            Moi quan tam
            <select name="interest" defaultValue="launch-offer">
              <option value="launch-offer">Uu dai ra mat</option>
              <option value="technical-demo">Demo ky thuat</option>
              <option value="business">Tu van doanh nghiep</option>
            </select>
          </label>
          <input name="source" type="hidden" value="helicorp-round-2-test" />
          <button className="primaryButton" type="submit" disabled={formStatus === "loading"}>
            {formStatus === "loading" ? "Dang gui..." : "Gui dang ky"}
          </button>
        </form>
      </section>

      <button className="chatLauncher" type="button" onClick={() => setChatOpen((value) => !value)} aria-label="Open chatbot">
        Chat
      </button>

      {chatOpen ? (
        <aside className="chatPanel" aria-label="HelioPure chatbot">
          <div className="chatHeader">
            <strong>HelioBot</strong>
            <button type="button" onClick={() => setChatOpen(false)} aria-label="Close chatbot">×</button>
          </div>
          <div className="chatBody">
            {chatLog.map((message, index) => (
              <p className={message.role === "bot" ? "botBubble" : "userBubble"} key={`${message.role}-${index}`}>
                {message.text}
              </p>
            ))}
          </div>
          <div className="quickReplies">
            {quickReplies.map((reply) => (
              <button type="button" key={reply} onClick={() => sendChat(reply)}>
                {reply}
              </button>
            ))}
          </div>
        </aside>
      ) : null}

      {toast ? <p className={`toast ${toast.tone}`}>{toast.text}</p> : null}
    </main>
  );
}
