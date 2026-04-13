export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  credits: number;
  creditEfficiency: number;
  popular?: boolean;
  features: string[];
}

export const tiers: SubscriptionTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    credits: 100,
    creditEfficiency: 1,
    features: [
      "100 credits/month",
      "All AI tools access",
      "Standard generation speed",
      "7-day history retention",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    price: 24.99,
    credits: 300,
    creditEfficiency: 1.2,
    popular: true,
    features: [
      "300 credits/month",
      "All AI tools access",
      "Priority generation speed",
      "30-day history retention",
      "Prompt optimization included",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49.99,
    credits: 750,
    creditEfficiency: 1.5,
    features: [
      "750 credits/month",
      "All AI tools access",
      "Fastest generation speed",
      "Unlimited history retention",
      "Prompt optimization included",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    credits: 2000,
    creditEfficiency: 2,
    features: [
      "2,000 credits/month",
      "All AI tools access",
      "Fastest generation speed",
      "Unlimited history retention",
      "Prompt optimization included",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];
