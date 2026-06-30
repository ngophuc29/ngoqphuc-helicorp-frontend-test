export const product = {
  name: "AuraBand X",
  heroTitle: "Your Health, Redefined.",
  description:
    "Experience the next generation of wellness tracking. Precision sensors meet elegant design in the all-new AuraBand X.",
  features: [
    {
      icon: "heart",
      title: "Precision Heart Rate",
      text: "Continuous optical monitoring with PPG technology provides clinical-grade accuracy during intense workouts or rest."
    },
    {
      icon: "battery",
      title: "14-Day Battery Life",
      text: "A custom low-power SoC ensures you spend more time moving and less time charging. Fast charge yields 2 days in 10 mins."
    },
    {
      icon: "moon",
      title: "Sleep AI Analysis",
      text: "Understand your circadian rhythm. Advanced algorithms track REM, deep sleep, and wake cycles to optimize your recovery."
    },
    {
      icon: "drop",
      title: "5ATM Water Resistant",
      text: "Swim, shower, or sweat. The hermetically sealed chassis protects internal components up to 50 meters deep."
    }
  ],
  specs: [
    ["Display", "1.6 inch AMOLED, 500 nits"],
    ["Battery", "250mAh (Up to 14 days)"],
    ["Sensors", "PPG, Accelerometer, SpO2"],
    ["Connectivity", "Bluetooth 5.3 LE"],
    ["Material", "Aerospace Aluminum"],
    ["Weight", "24g (without strap)"]
  ],
  reviews: [
    {
      quote:
        "The heart rate accuracy rivals chest straps I have used. The battery life is just phenomenal. It truly disappears on the wrist until you need it.",
      name: "Sarah J.",
      role: "Triathlete"
    },
    {
      quote:
        "Finally a tracker that looks like a premium watch rather than a plastic toy. The sleep insights have completely changed my recovery routine.",
      name: "David M.",
      role: "Tech Reviewer"
    },
    {
      quote:
        "I wear it in the pool every morning. The display is incredibly bright underwater and the stroke tracking is surprisingly precise.",
      name: "Elena R.",
      role: "Masters Swimmer"
    },
    {
      quote:
        "The SpO2 readings are incredibly fast and accurate during my high-altitude climbs. The aerospace aluminum casing feels weightless on my wrist.",
      name: "Marcus K.",
      role: "Mountaineer"
    },
    {
      quote:
        "The AI sleep analysis matches my actual recovery levels perfectly. I know exactly when to push hard or take a rest day now.",
      name: "Linh N.",
      role: "CrossFit Coach"
    },
    {
      quote:
        "Charged it once and it lasted almost two full weeks of active tracking. The magnetic dock snaps securely and charges in under an hour.",
      name: "Alex P.",
      role: "Marathon Runner"
    },
    
  ]
};

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  meta: string;
}

export const products: ProductItem[] = [
  {
    id: "auraband-x",
    name: "AuraBand X",
    price: 99,
    description: "Next-generation smart fitness band featuring high-precision PPG heart rate tracking and an ultra-lightweight design.",
    image: "/images/auraband-hero.png",
    category: "Wearable",
    meta: "Matte Black / 24g"
  },
  {
    id: "pulse-loop-strap",
    name: "Pulse Loop Strap",
    price: 29,
    description: "Premium sport silicone strap, engineered for extreme durability, breathability, and complete water resistance.",
    image: "/images/aura-runner.png",
    category: "Strap",
    meta: "Sport silicone / teal"
  },
  {
    id: "recovery-dock",
    name: "Recovery Dock",
    price: 39,
    description: "Convenient magnetic fast charging dock, fully recharging your device in just 45 minutes.",
    image: "/images/auraband-technical.png",
    category: "Charger",
    meta: "Fast charge / graphite"
  },
  {
    id: "aurabuds-pro",
    name: "AuraBuds Pro",
    price: 149,
    description: "Next-generation wireless earbuds featuring Active Noise Cancellation (ANC) and direct metric syncing with AuraBand X.",
    image: "/images/aura-yoga.png",
    category: "Audio",
    meta: "Active Noise Cancelling"
  }
];
