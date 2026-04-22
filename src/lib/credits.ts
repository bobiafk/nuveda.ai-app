export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  features: string[];
}

export const tiers: SubscriptionTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    credits: 100,
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
    popular: true,
    features: [
      "300 credits/month",
      "All AI tools access",
      "Standard generation speed",
      "30-day history retention",
      "Prompt optimization included",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49.99,
    credits: 750,
    features: [
      "750 credits/month",
      "All AI tools access",
      "Fastest generation speed",
      "Unlimited history retention",
      "Prompt optimization included",
      "API access",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    credits: 2000,
    features: [
      "2,000 credits/month",
      "All AI tools access",
      "Fastest generation speed",
      "Unlimited history retention",
      "Prompt optimization included",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
  },
];
