"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState, useRef } from "react";
import { product, products, ProductItem } from "@/lib/product";

type Toast = {
  text: string;
  tone: "success" | "error" | "info";
};

type CartItem = {
  product: ProductItem;
  quantity: number;
};

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

const motionImages = [
  { src: "/images/aura-runner.png", alt: "Runner using AuraBand X during training" },
  { src: "/images/aura-yoga.png", alt: "Athlete using AuraBand X during recovery yoga" },
  { src: "/images/auraband-hero.png", alt: "AuraBand X product in studio lighting" },
  { src: "/images/auraband-technical.png", alt: "Exploded technical view of AuraBand X components" },
  { src: "/images/aura-runner.png", alt: "PPG optical sensor tracking heart rate zones" },
  { src: "/images/aura-yoga.png", alt: "AuraBand X sleep AI analysis tracking deep sleep" },
  { src: "/images/auraband-hero.png", alt: "AuraBand X Matte Black aluminum design" }
];

const iconLabel: Record<string, string> = {
  heart: "HR",
  battery: "14",
  moon: "AI",
  drop: "5A"
};

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [motionIndex, setMotionIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);

  // E-commerce states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Scroll to Top state
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scrollytelling state
  const [activeChapter, setActiveChapter] = useState(0);

  // Carousel responsive states
  const [reviewIndex, setReviewIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [visibleMotion, setVisibleMotion] = useState(3);
  const [reviewsHovered, setReviewsHovered] = useState(false);
  const [motionHovered, setMotionHovered] = useState(false);

  // Touch tracking refs
  const touchStartReviewsX = useRef<number | null>(null);
  const touchStartReviewsY = useRef<number | null>(null);
  const touchStartMotionX = useRef<number | null>(null);
  const touchStartMotionY = useRef<number | null>(null);

  // Wheel / Trackpad tracking refs
  const wheelAccumulatorMotion = useRef(0);
  const wheelCooldownMotion = useRef(false);
  const wheelAccumulatorReviews = useRef(0);
  const wheelCooldownReviews = useRef(false);

  // Touch handlers for mobile swipe
  const handleTouchStartReviews = (e: React.TouchEvent) => {
    touchStartReviewsX.current = e.touches[0].clientX;
    touchStartReviewsY.current = e.touches[0].clientY;
  };

  const handleTouchEndReviews = (e: React.TouchEvent) => {
    if (touchStartReviewsX.current === null || touchStartReviewsY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartReviewsX.current - touchEndX;
    const diffY = touchStartReviewsY.current - touchEndY;

    // Slide only if horizontal movement is dominant and meets threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      moveReview(diffX > 0 ? 1 : -1);
    }
    touchStartReviewsX.current = null;
    touchStartReviewsY.current = null;
  };

  const handleTouchStartMotion = (e: React.TouchEvent) => {
    touchStartMotionX.current = e.touches[0].clientX;
    touchStartMotionY.current = e.touches[0].clientY;
  };

  const handleTouchEndMotion = (e: React.TouchEvent) => {
    if (touchStartMotionX.current === null || touchStartMotionY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartMotionX.current - touchEndX;
    const diffY = touchStartMotionY.current - touchEndY;

    // Slide only if horizontal movement is dominant and meets threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      moveMotion(diffX > 0 ? 1 : -1);
    }
    touchStartMotionX.current = null;
    touchStartMotionY.current = null;
  };

  // Trackpad / Mouse wheel horizontal swipe handlers
  const handleWheelMotion = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (wheelCooldownMotion.current) return;

      wheelAccumulatorMotion.current += e.deltaX;

      if (Math.abs(wheelAccumulatorMotion.current) > 50) {
        const direction = wheelAccumulatorMotion.current > 0 ? 1 : -1;
        moveMotion(direction);

        wheelAccumulatorMotion.current = 0;
        wheelCooldownMotion.current = true;
        setTimeout(() => {
          wheelCooldownMotion.current = false;
        }, 500);
      }
    }
  };

  const handleWheelReviews = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (wheelCooldownReviews.current) return;

      wheelAccumulatorReviews.current += e.deltaX;

      if (Math.abs(wheelAccumulatorReviews.current) > 50) {
        const direction = wheelAccumulatorReviews.current > 0 ? 1 : -1;
        moveReview(direction);

        wheelAccumulatorReviews.current = 0;
        wheelCooldownReviews.current = true;
        setTimeout(() => {
          wheelCooldownReviews.current = false;
        }, 500);
      }
    }
  };

  const maxMotionIndex = Math.max(0, motionImages.length - visibleMotion);
  const maxReviewIndex = Math.max(0, product.reviews.length - visibleReviews);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! I am AuraBot, your virtual assistant for AuraBand X. How can I help you today? Feel free to ask about battery life, water resistance, sensors, or pricing!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((toastValue: Toast) => {
    setToast(toastValue);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const trackClick = useCallback((elementName: string) => {
    showToast({ text: `Click on "${elementName}" tracked.`, tone: "info" });
  }, [showToast]);

  // Track scroll behavior & Back to Top visibility
  useEffect(() => {
    let tracked = false;
    const onScroll = () => {
      setParallaxY(Math.min(window.scrollY * 0.08, 42));

      // Track scroll once
      if (!tracked && window.scrollY > window.innerHeight * 0.5) {
        tracked = true;
        showToast({ text: "User scroll behavior tracked.", tone: "info" });
      }

      // Back to top button visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showToast]);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedTheme = window.localStorage.getItem("auraband-theme");
      const storedCart = window.localStorage.getItem("auraband-cart");
      const storedWishlist = window.localStorage.getItem("auraband-wishlist");

      setDarkMode(storedTheme === "dark");
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch {}
      }
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch {}
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Save to localStorage when states change
  useEffect(() => {
    window.localStorage.setItem("auraband-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem("auraband-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem("auraband-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Resize listener to adjust visible items in carousels
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const padding = Math.min(192, Math.max(48, w * 0.12));
      const availableWidth = w - padding;

      // Review card: 26rem (416px) + 20px gap = 436px
      const rCount = Math.max(1, Math.round((availableWidth + 20) / 436));
      // Motion card: 34rem (544px) + 18px gap = 562px
      const mCount = Math.max(1, Math.round((availableWidth + 18) / 562));

      setVisibleReviews(rCount);
      setVisibleMotion(mCount);

      // Adjust indexes if they exceed new bounds
      setReviewIndex((curr) => Math.min(curr, Math.max(0, product.reviews.length - rCount)));
      setMotionIndex((curr) => Math.min(curr, Math.max(0, motionImages.length - mCount)));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play for In Motion Carousel
  useEffect(() => {
    if (motionHovered || maxMotionIndex <= 0) return;
    const interval = setInterval(() => {
      setMotionIndex((current) => {
        const next = current + 1;
        return next > maxMotionIndex ? 0 : next;
      });
    }, 4500); // Slide every 4.5 seconds
    return () => clearInterval(interval);
  }, [motionHovered, maxMotionIndex]);

  // Auto-play for Reviews Carousel
  useEffect(() => {
    if (reviewsHovered || maxReviewIndex <= 0) return;
    const interval = setInterval(() => {
      setReviewIndex((current) => {
        const next = current + 1;
        return next > maxReviewIndex ? 0 : next;
      });
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(interval);
  }, [reviewsHovered, maxReviewIndex]);

  // Scroll-reveal animation using IntersectionObserver (consistent across all browsers)
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Animate once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px" // Trigger slightly before entering viewport
      }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scrollytelling observer
  useEffect(() => {
    const cards = document.querySelectorAll(".storyCard");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-chapter") || "0", 10);
            setActiveChapter(index);
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px" // Trigger when card enters the middle 30% of viewport
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Newsletter
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("loading");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });

      const result = (await response.json()) as { message: string };
      setFormStatus(response.ok ? "success" : "error");
      showToast({ text: result.message, tone: response.ok ? "success" : "error" });

      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setFormStatus("error");
      showToast({ text: "Server connection error.", tone: "error" });
    }
  };

  // E-commerce logic
  const addToCart = (prod: ProductItem) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === prod.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product: prod, quantity: 1 }];
    });
    showToast({ text: `Added ${prod.name} to cart.`, tone: "success" });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((current) => {
      const exists = current.includes(id);
      if (exists) {
        showToast({ text: `Removed ${name} from wishlist.`, tone: "info" });
        return current.filter((item) => item !== id);
      } else {
        showToast({ text: `Added ${name} to wishlist.`, tone: "success" });
        return [...current, id];
      }
    });
  };

  // Checkout submission
  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      paymentMethod: formData.get("paymentMethod") as string,
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      subtotal: cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        setOrderId(result.orderId);
        setOrderSuccess(true);
        setCart([]); // Clear cart
        showToast({ text: "Order placed successfully!", tone: "success" });
      } else {
        showToast({ text: result.message || "Failed to place order.", tone: "error" });
      }
    } catch {
      showToast({ text: "Server connection error.", tone: "error" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Chatbot logic
  const handleChatSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");

    const newMsg: ChatMessage = { sender: "user", text: userText, timestamp: new Date() };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatLoading(true);

    try {
      const historyPayload = chatMessages.slice(-6).map((msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("model" as const),
        text: msg.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: historyPayload })
      });

      const result = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: result.reply, timestamp: new Date() }
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I am having trouble connecting right now. Please try again later.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const sendQuickQuestion = (question: string) => {
    setChatInput(question);
    setTimeout(() => {
      const inputEl = document.getElementById("chat-input") as HTMLInputElement;
      if (inputEl) {
        inputEl.value = question;
      }
      setChatInput(question);
      setChatLoading(true);
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: chatMessages.slice(-6).map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            text: msg.text
          }))
        })
      })
        .then((res) => res.json())
        .then((result) => {
          setChatMessages((prev) => [
            ...prev,
            { sender: "user", text: question, timestamp: new Date() },
            { sender: "bot", text: result.reply, timestamp: new Date() }
          ]);
        })
        .catch(() => {
          setChatMessages((prev) => [
            ...prev,
            { sender: "user", text: question, timestamp: new Date() },
            { sender: "bot", text: "Sorry, connection failed. Please try again.", timestamp: new Date() }
          ]);
        })
        .finally(() => {
          setChatLoading(false);
          setChatInput("");
        });
    }, 0);
  };

  const moveMotion = (direction: number) => {
    setMotionIndex((current) => {
      const next = current + direction;
      if (next > maxMotionIndex) return 0;
      if (next < 0) return maxMotionIndex;
      return next;
    });
  };

  const moveReview = (direction: number) => {
    setReviewIndex((current) => {
      const next = current + direction;
      if (next > maxReviewIndex) return 0;
      if (next < 0) return maxReviewIndex;
      return next;
    });
  };



  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <main className={darkMode ? "site dark" : "site"}>
      <div className="pageFrame">
        {/* TOPBAR */}
        <header className="topbar">
          <a className="brand" href="#hero" aria-label="AuraBand X home" onClick={() => trackClick("Brand Logo")}>
            AuraBand X
          </a>
          <nav aria-label="Main navigation">
            <a href="#features" onClick={() => trackClick("Nav: Features")}>Features</a>
            <a href="#specs" onClick={() => trackClick("Nav: Specs")}>Specs</a>
            <a href="#commerce" onClick={() => trackClick("Nav: Shop")}>Shop</a>
            <a href="#reviews" onClick={() => trackClick("Nav: Reviews")}>Reviews</a>
          </nav>
          <div className="topActions">
            <button
              className="themeIconButton"
              type="button"
              onClick={() => {
                setDarkMode((value) => !value);
                trackClick(`Theme Toggle (${!darkMode ? "Dark" : "Light"})`);
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                // Sun Icon (Switch to Light)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                // Moon Icon (Switch to Dark)
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>
            <button
              className="wishlistIconButton"
              type="button"
              onClick={() => {
                setWishlistOpen(true);
                trackClick("Wishlist Icon");
              }}
              aria-label="Open wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              {wishlist.length > 0 && <span className="wishlistBadge">{wishlist.length}</span>}
            </button>
            <button
              className="cartIconButton"
              type="button"
              onClick={() => {
                setCartOpen(true);
                trackClick("Cart Icon");
              }}
              aria-label="Open shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              {cartTotalItems > 0 && <span className="cartBadge">{cartTotalItems}</span>}
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="hero" id="hero">
          <div className="heroCopy reveal">
            <h1>
              Your Health,
              <span>Redefined.</span>
            </h1>
            <p>
              Experience the next generation of wellness tracking. Precision sensors meet elegant design in the all-new AuraBand X.
            </p>
            <div className="heroActions">
              <a className="primaryButton" href="#commerce" onClick={() => trackClick("Hero: Get Yours Today")}>
                Get Yours Today
              </a>
              <a className="secondaryButton" href="#features" onClick={() => trackClick("Hero: Explore Features")}>
                Explore Features
              </a>
            </div>
          </div>
          <div className={heroLoaded ? "heroVisual reveal loaded" : "heroVisual reveal"} style={{ transform: `translateY(${parallaxY}px)` }}>
            {!heroLoaded ? <span className="imageSkeleton" aria-hidden="true" /> : null}
            <Image
              src="/images/auraband-hero.png"
              alt="AuraBand X floating smart fitness wearable"
              width={1264}
              height={864}
              priority
              sizes="(max-width: 900px) 92vw, 46vw"
              onLoad={() => setHeroLoaded(true)}
            />
          </div>
        </section>

        {/* SCROLLYTELLING */}
        <section className="storySection section" aria-label="AuraBand X scrollytelling">
          <div className="storySticky">
            <h2>From signal to recovery, every scroll reveals the system.</h2>
            <div className="storyDevice" style={{ transform: `translateY(${parallaxY * 0.55}px)` }}>
              <Image
                src="/images/auraband-technical.png"
                alt="Sense - Sensors"
                width={520}
                height={356}
                sizes="(max-width: 900px) 80vw, 28vw"
                className={`storyImage ${activeChapter === 0 ? "active" : ""}`}
              />
              <Image
                src="/images/aura-runner.png"
                alt="Adapt - Training"
                width={520}
                height={356}
                sizes="(max-width: 900px) 80vw, 28vw"
                className={`storyImage ${activeChapter === 1 ? "active" : ""}`}
              />
              <Image
                src="/images/auraband-hero.png"
                alt="Improve - System"
                width={520}
                height={356}
                sizes="(max-width: 900px) 80vw, 28vw"
                className={`storyImage ${activeChapter === 2 ? "active" : ""}`}
              />
            </div>
          </div>
          <div className="storyChapters">
            <article
              className={`storyCard ${activeChapter === 0 ? "active" : ""}`}
              data-chapter="0"
              style={{ transform: `translateY(${-parallaxY * 0.15}px)` }}
            >
              <span>Chapter 01 / Sense</span>
              <h3>Reads the rhythm behind every session.</h3>
              <p>
                Equipped with advanced optical PPG sensors and a dedicated SpO2 infrared module, AuraBand X continuously captures your vital signs. By analyzing blood oxygen saturation, heart rate variability, and movement patterns, it translates complex medical-grade data into intuitive, actionable recovery metrics.
              </p>
            </article>
            <article
              className={`storyCard ${activeChapter === 1 ? "active" : ""}`}
              data-chapter="1"
              style={{ transform: `translateY(${parallaxY * 0.12}px)` }}
            >
              <span>Chapter 02 / Adapt</span>
              <h3>Turns raw metrics into better timing.</h3>
              <p>
                Your body is dynamic, and your training should be too. AuraBand X dynamically calculates your daily exertion and fatigue levels. Instead of generic alerts, it provides personalized training intensity recommendations, active recovery prompts, and hydration guides tailored to your immediate physiological needs.
              </p>
            </article>
            <article
              className={`storyCard ${activeChapter === 2 ? "active" : ""}`}
              data-chapter="2"
              style={{ transform: `translateY(${-parallaxY * 0.1}px)` }}
            >
              <span>Chapter 03 / Improve</span>
              <h3>Keeps progress visible without noise.</h3>
              <p>
                Track your long-term wellness trends without the cognitive overload. The companion app synthesizes weekly and monthly cardiovascular improvements, sleep efficiency gains, and stress resilience scores into glanceable reports, while keeping detailed technical logs available for deep analysis.
              </p>
            </article>
          </div>
        </section>

        {/* FEATURES */}
        <section className="featurePanel section" id="features">
          <div className="centerHeader reveal">
            <h2>Intelligent Inside.</h2>
            <p>Advanced metrics tracking housed within an aerospace-grade casing.</p>
          </div>
          <div className="featureGrid">
            {product.features.map((feature) => (
              <article className={`featureCard ${feature.icon} reveal`} key={feature.title}>
                <span className="featureIcon" aria-hidden="true">
                  {iconLabel[feature.icon]}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>



        {/* SPECS */}
        <section className="specSection section" id="specs">
          <div className="specCopy reveal">
            <h2>Technical Mastery.</h2>
            <dl className="specList">
              {product.specs.map(([label, value]) => (
                <div className="specRow" key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="technicalImage reveal">
            <Image
              src="/images/auraband-technical.png"
              alt="Exploded technical view of AuraBand X smart fitness band"
              width={1240}
              height={896}
              sizes="(max-width: 900px) 92vw, 44vw"
            />
          </div>
        </section>

        {/* SHOP SECTION (NEW REVAMPED MINI E-COMMERCE) */}
        <section className="shopSection section" id="commerce">
          <div className="centerHeader reveal">
            <p className="sectionLabel">AuraBand Shop</p>
            <h2>Choose Your Smart Device</h2>
            <p>Explore the AuraBand X ecosystem. All orders are processed securely and shipped worldwide.</p>
          </div>

          <div className="shopGrid">
            {products.map((item) => {
              const isLiked = wishlist.includes(item.id);
              return (
                <article
                  className="productCard reveal"
                  key={item.id}
                >
                  <div className="productImageContainer">
                    <Image src={item.image} alt={item.name} width={400} height={280} className="productImg" />
                    <button
                      type="button"
                      className={isLiked ? "wishlistBtn active" : "wishlistBtn"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id, item.name);
                      }}
                      aria-label="Add to wishlist"
                    >
                      ♥
                    </button>
                  </div>
                  <div className="productInfo">
                    <span className="productCat">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p className="productDesc">{item.description}</p>
                    <div className="productMetaRow">
                      <span className="productPrice">${item.price}</span>
                      <button
                        type="button"
                        className="addToCartBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* MOTION CAROUSEL */}
        <section
          className="motionSection section"
          onMouseEnter={() => setMotionHovered(true)}
          onMouseLeave={() => setMotionHovered(false)}
          onTouchStart={handleTouchStartMotion}
          onTouchEnd={handleTouchEndMotion}
          onWheel={handleWheelMotion}
        >
          <div className="motionHeader reveal">
            <h2>In Motion.</h2>
            <div className="sliderControls">
              <button type="button" onClick={() => moveMotion(-1)} aria-label="Previous motion image">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <button type="button" onClick={() => moveMotion(1)} aria-label="Next motion image">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
          <div className="motionRail" style={{ "--motion-index": motionIndex } as React.CSSProperties}>
            {motionImages.map((image, idx) => (
              <div className="motionCard" key={`${image.src}-${idx}`}>
                <Image src={image.src} alt={image.alt} width={1688} height={928} sizes="(max-width: 700px) 86vw, 34rem" />
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section
          className="reviews section"
          id="reviews"
          onMouseEnter={() => setReviewsHovered(true)}
          onMouseLeave={() => setReviewsHovered(false)}
        >
          <div className="motionHeader reveal">
            <div>
              <p className="sectionLabel">Testimonials</p>
              <h2>Trusted by Athletes.</h2>
            </div>
            <div className="sliderControls">
              <button type="button" onClick={() => moveReview(-1)} aria-label="Previous review">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <button type="button" onClick={() => moveReview(1)} aria-label="Next review">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
          <div
            className="reviewViewport"
            onTouchStart={handleTouchStartReviews}
            onTouchEnd={handleTouchEndReviews}
            onWheel={handleWheelReviews}
          >
            <div className="reviewRail" style={{ "--review-index": reviewIndex } as React.CSSProperties}>
              {product.reviews.map((review, idx) => (
                <article className="reviewCard reveal" key={idx}>
                  <div className="stars" aria-label="5 star rating">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    ))}
                  </div>
                  <blockquote>&quot;{review.quote}&quot;</blockquote>
                  <div className="reviewer">
                    <span>{review.name.slice(0, 1)}</span>
                    <div className="reviewerInfo">
                      <strong>{review.name}</strong>
                      <span className="reviewerRole">{review.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletterWrap section" id="newsletter">
          <div className="newsletter reveal">
            <h2>Stay Ahead of the Curve.</h2>
            <p>Join our newsletter for exclusive early access to software updates, new band colors, and wellness tips.</p>
            <form onSubmit={onSubmit}>
              <input name="email" type="email" required placeholder="Enter your email" aria-label="Email address" />
              <input name="source" type="hidden" value="helicorp-round-2-auraband" />
              <button type="submit" disabled={formStatus === "loading"}>
                {formStatus === "loading" ? "Sending..." : "Subscribe"}
              </button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer" id="support">
          <div>
            <h2>AuraBand X</h2>
            <p>&copy; 2026 AuraBand Technologies. All rights reserved.</p>
          </div>
          <div>
            <h3>Product</h3>
            <a href="#features">Features</a>
            <a href="#specs">Specifications</a>
            <a href="#commerce">Accessories</a>
            <a href="#reviews">Reviews</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="#support">Help Center</a>
            <a href="#support">Warranty</a>
            <a href="#support">Returns</a>
            <a href="#support">Contact Us</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="#support">Privacy Policy</a>
            <a href="#support">Terms of Service</a>
            <a href="#support">Cookie Policy</a>
            <a href="#support">Sustainability</a>
          </div>
        </footer>
      </div>

      {/* WISHLIST DRAWER */}
      {wishlistOpen && (
        <div className="wishlistOverlay" onClick={() => setWishlistOpen(false)}>
          <div className="wishlistDrawer" onClick={(e) => e.stopPropagation()}>
            <div className="wishlistHeader">
              <h2>Your Wishlist</h2>
              <button type="button" className="closeBtn" onClick={() => setWishlistOpen(false)}>✕</button>
            </div>

            {wishlist.length === 0 ? (
              <div className="wishlistEmpty">
                <p>Your wishlist is empty.</p>
                <button type="button" className="shopBtn" onClick={() => setWishlistOpen(false)}>Shop Now</button>
              </div>
            ) : (
              <div className="wishlistBody">
                {wishlist.map((id) => {
                  const item = products.find((p) => p.id === id);
                  if (!item) return null;
                  return (
                    <div className="wishlistItem" key={item.id}>
                      <Image src={item.image} alt={item.name} width={70} height={52} />
                      <div className="wishlistItemInfo">
                        <h3>{item.name}</h3>
                        <span>${item.price}</span>
                      </div>
                      <div className="wishlistItemActions">
                        <button
                          type="button"
                          className="addToCartBtnSmall"
                          onClick={() => {
                            addToCart(item);
                          }}
                          aria-label="Add to cart"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          className="removeWishlistItemBtn"
                          onClick={() => toggleWishlist(item.id, item.name)}
                          aria-label="Remove from wishlist"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cartOverlay" onClick={() => setCartOpen(false)}>
          <div className="cartDrawer" onClick={(e) => e.stopPropagation()}>
            <div className="cartHeader">
              <h2>Your Cart</h2>
              <button type="button" className="closeBtn" onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="cartEmpty">
                <p>Your cart is empty.</p>
                <button type="button" className="shopBtn" onClick={() => setCartOpen(false)}>Shop Now</button>
              </div>
            ) : (
              <>
                <div className="cartBody">
                  {cart.map((item) => (
                    <div className="cartItem" key={item.product.id}>
                      <Image src={item.product.image} alt={item.product.name} width={70} height={52} />
                      <div className="cartItemInfo">
                        <h3>{item.product.name}</h3>
                        <span>${item.product.price}</span>
                      </div>
                      <div className="cartItemQty">
                        <button type="button" onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cartFooter">
                  <div className="subtotalRow">
                    <span>Subtotal:</span>
                    <strong>${cartSubtotal}</strong>
                  </div>
                  <button
                    type="button"
                    className="checkoutBtn"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="checkoutOverlay" onClick={() => !checkoutLoading && setCheckoutOpen(false)}>
          <div className="checkoutModal" onClick={(e) => e.stopPropagation()}>
            <div className="checkoutHeader">
              <h2>{orderSuccess ? "Order Placed" : "Checkout Details"}</h2>
              {!checkoutLoading && (
                <button
                  type="button"
                  className="closeBtn"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderSuccess(false);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {orderSuccess ? (
              <div className="checkoutSuccess">
                <div className="successIcon">✓</div>
                <h3>Thank you for your purchase!</h3>
                <p>Your order has been received and is being processed.</p>
                <div className="orderInfo">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <button
                  type="button"
                  className="primaryButton"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderSuccess(false);
                  }}
                >
                  Continue Exploring
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="checkoutForm">
                <div className="formGroup">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" required placeholder="John Doe" />
                </div>
                <div className="formGroup">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="tel" required placeholder="+1 (555) 000-0000" />
                </div>
                <div className="formGroup">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required placeholder="email@example.com" />
                </div>
                <div className="formGroup">
                  <label htmlFor="address">Shipping Address</label>
                  <input id="address" name="address" type="text" required placeholder="123 Main St, New York, NY 10001" />
                </div>
                <div className="formGroup">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select id="paymentMethod" name="paymentMethod" required>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="checkoutSummary">
                  <h3>Your Order</h3>
                  <div className="summaryItems">
                    {cart.map((item) => (
                      <div className="summaryRow" key={item.product.id}>
                        <span>{item.product.name} (x{item.quantity})</span>
                        <span>${item.product.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="summaryTotal">
                    <span>Total:</span>
                    <strong>${cartSubtotal}</strong>
                  </div>
                </div>

                <button type="submit" className="placeOrderBtn" disabled={checkoutLoading}>
                  {checkoutLoading ? "Processing..." : "Confirm Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHATBOT */}
      <button
        className={chatOpen ? "chatLauncher active" : "chatLauncher"}
        type="button"
        onClick={() => {
          setChatOpen((value) => !value);
          trackClick(!chatOpen ? "Chatbot Open" : "Chatbot Close");
        }}
        aria-label="Open support chat"
      >
        {chatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {chatOpen && (
        <aside className="chatPanel" aria-label="AuraBand support chatbot">
          <div className="chatPanelHeader">
            <div className="chatHeaderTitle">
              <span className="onlineStatus" />
              <div className="chatHeaderMeta">
                <strong>AuraBot</strong>
                <span className="chatSubtitle">AI Assistant</span>
              </div>
            </div>
            <button
              type="button"
              className="chatCloseBtn"
              onClick={() => {
                setChatOpen(false);
                trackClick("Chatbot Close");
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chatMessagesList">
            {chatMessages.map((msg, i) => (
              <div className={`chatMsg ${msg.sender}`} key={i}>
                <p>{msg.text}</p>
              </div>
            ))}
            {chatLoading && (
              <div className="chatMsg bot typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="chatSuggestions">
            <button type="button" onClick={() => sendQuickQuestion("How long is the battery life?")}>🔋 Battery</button>
            <button type="button" onClick={() => sendQuickQuestion("Is it water resistant?")}>💧 Water</button>
            <button type="button" onClick={() => sendQuickQuestion("What are the product prices?")}>💰 Price</button>
            <button type="button" onClick={() => sendQuickQuestion("What sensors does it have?")}>🧬 Sensors</button>
          </div>

          <form onSubmit={handleChatSubmit} className="chatInputArea">
            <input
              id="chat-input"
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AuraBot..."
              disabled={chatLoading}
              autoComplete="off"
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()} aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </aside>
      )}

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button className="backToTop" onClick={scrollToTop} aria-label="Scroll to top">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
      )}

      {/* TOAST NOTIFICATION */}
      {toast ? <p className={`toast ${toast.tone}`}>{toast.text}</p> : null}
    </main>
  );
}
