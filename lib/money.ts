export function formatWeight(grams: number) {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)} kg`;
  }
  return `${grams} g`;
}

/** Typical per-mango ranges by Alphonso grade (A1–A3 sold by the dozen). */
const GRADE_WEIGHT_PER_PC_DISPLAY: Record<string, string> = {
  A1: "250-305 g/pc",
  A2: "200-250 g/pc",
  A3: "150-200 g/pc",
};

/** Weight line for PDP/shop cards: fixed range by grade when known, else Shopify weight. */
export function formatGradeWeightDisplay(
  grade: string | null | undefined,
  weightGramsFallback: number
): string {
  const key = grade?.toUpperCase();
  if (key && GRADE_WEIGHT_PER_PC_DISPLAY[key]) {
    return GRADE_WEIGHT_PER_PC_DISPLAY[key];
  }
  return `${formatWeight(weightGramsFallback)}/pc`;
}

export function formatINR(cents: number) {
  const rupees = cents / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export const TAX_RATE = 0.05; // GST 5% on processed food
export const SHIPPING_FLAT_CENTS = 0; // Free delivery
export const FREE_SHIPPING_THRESHOLD_CENTS = 0; // Free for all orders

// Delivery info - centralized for consistency across the site
export const DELIVERY_INFO = {
  isFree: true,
  maharashtra: {
    days: "4-5",
    label: "Maharashtra",
  },
  otherStates: {
    days: "8-9",
    label: "Other States",
  },
  shortText: "Free delivery across India",
  fullText: "Free delivery: Maharashtra 4-5 days, Other States 8-9 days",
  bannerText: "Free delivery all over India · Maharashtra 4-5 days · Other States 8-9 days",
} as const;

export function priceBreakdown(subtotalCents: number) {
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
  const totalCents = subtotalCents + taxCents + shippingCents;
  return { subtotalCents, taxCents, shippingCents, totalCents };
}
