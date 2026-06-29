import { NextResponse } from "next/server";

type Message = {
  role: "user" | "model";
  text: string;
};

// Smart local Q&A fallback in case Gemini API is not configured or fails
function getLocalResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("greet") || q.includes("support")) {
    return "Hello! I am AuraBot, your virtual assistant for AuraBand X. How can I help you today? You can ask me about battery life, water resistance, sensors, or pricing!";
  }
  if (q.includes("battery") || q.includes("charge") || q.includes("pin") || q.includes("day") || q.includes("last")) {
    return "AuraBand X is equipped with a 250mAh battery that provides up to 14 days of typical usage on a single charge. It supports magnetic fast charging via the Recovery Dock—a quick 10-minute charge gives you 2 days of battery life.";
  }
  if (q.includes("water") || q.includes("swim") || q.includes("shower") || q.includes("rain") || q.includes("resist")) {
    return "AuraBand X has a 5ATM water resistance rating (engineered to withstand pressures equivalent to a depth of 50 meters). You can confidently wear it while swimming, showering, or during intense sweaty workouts.";
  }
  if (q.includes("sensor") || q.includes("heart") || q.includes("rate") || q.includes("spo2") || q.includes("sleep") || q.includes("track")) {
    return "AuraBand X integrates a next-generation PPG optical heart rate sensor for 24/7 continuous monitoring, an SpO2 sensor for blood oxygen tracking, a 3-axis accelerometer for activity tracking, and AI-powered sleep analysis (tracking deep, light, REM, and wake cycles).";
  }
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("buy") || q.includes("shop") || q.includes("pricing")) {
    return "Here is the current pricing for our ecosystem:\n1. AuraBand X: $99\n2. Pulse Loop Strap: $29\n3. Recovery Dock: $39\n4. AuraBuds Pro: $149\nYou can scroll up to our Shop section, add them to your cart, and place an order directly!";
  }
  if (q.includes("feature") || q.includes("spec") || q.includes("highlight") || q.includes("what does it do")) {
    return "AuraBand X's key features include: Clinical-grade heart rate tracking, AI-powered sleep analysis, an exceptional 14-day battery life, 5ATM water resistance, an ultra-lightweight aerospace-grade aluminum casing (24g), and smart notifications.";
  }
  if (q.includes("earbud") || q.includes("aurabuds") || q.includes("headphone")) {
    return "AuraBuds Pro ($149) are our premium wireless earbuds featuring Active Noise Cancellation (ANC), high-fidelity sound, and direct workout metrics syncing with your AuraBand X.";
  }

  return "Thank you for your question! AuraBand X is a premium health tracker with a 14-day battery life, 5ATM water resistance, and advanced PPG sensors. Let me know if you would like to know more about any specific feature!";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: string; history?: Message[] } | null;

  if (!body?.message) {
    return NextResponse.json({ message: "Please enter a message." }, { status: 400 });
  }

  const userMessage = body.message.trim();
  const history = body.history ?? [];
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const reply = getLocalResponse(userMessage);
    return NextResponse.json({ reply });
  }

  try {
    const systemPrompt = `You are AuraBot, a friendly and professional virtual assistant for the AuraBand X smart wearable brand by Healthy Living Corporation (Helicorp).
Please answer user questions concisely, clearly, and professionally in English.
Keep your responses focused on our products and services.

Product Information for Reference:
1. AuraBand X ($99): Main health band. Aerospace aluminum casing (24g), 1.6-inch AMOLED 500 nits display. 250mAh battery (up to 14 days, 10-min charge for 2 days). 5ATM water resistance. PPG heart rate sensor, SpO2, AI sleep analysis, workout tracking.
2. Pulse Loop Strap ($29): Premium sport silicone strap in Teal. Lightweight, breathable, and waterproof.
3. Recovery Dock ($39): Magnetic fast charging dock in Graphite.
4. AuraBuds Pro ($149): Active Noise Cancellation (ANC) wireless earbuds. Syncs workout metrics directly with AuraBand X.

If the user asks how to buy, guide them to use the Shop section on the landing page, add items to the cart, and proceed to Checkout.`;

    // Map history to Gemini format
    const contents = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? getLocalResponse(userMessage);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API call failed, falling back to local responder:", error);
    const reply = getLocalResponse(userMessage);
    return NextResponse.json({ reply });
  }
}
