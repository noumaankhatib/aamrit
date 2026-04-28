import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ShopNav from "@/components/shop/ShopNav";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
  metaDescription: string;
  keywords: string[];
};

const BLOG_POSTS: Record<string, BlogPost> = {
  "how-to-identify-real-alphonso-mango": {
    slug: "how-to-identify-real-alphonso-mango",
    title: "How to Identify Real Alphonso Mango: 7 Expert Tips",
    excerpt:
      "Learn the telltale signs that distinguish genuine Ratnagiri Alphonso from fake or artificially ripened mangoes.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1600&q=85",
    category: "Guide",
    readTime: "5 min read",
    date: "April 15, 2026",
    metaDescription:
      "Learn 7 expert tips to identify genuine Ratnagiri Alphonso mangoes from fake ones. Discover the signs of real Hapus mango vs artificially ripened fruit.",
    keywords: [
      "real alphonso mango",
      "how to identify alphonso",
      "genuine hapus mango",
      "ratnagiri alphonso tips",
      "fake mango identification",
    ],
    content: `
## Why Identifying Real Alphonso Matters

Every mango season, the Indian market is flooded with mangoes falsely labeled as "Alphonso" or "Hapus." Some estimates suggest that up to 70% of mangoes sold as Alphonso in major cities are either different varieties or artificially ripened Alphonso that has lost its signature qualities.

At Aamrit, we've been growing Alphonso on our family farms in Ratnagiri and Raigad since 2008. Here's what three generations of mango farmers have taught us about identifying the real thing.

## 1. The Aroma Test (Most Reliable)

**Real Alphonso:** Has a strong, intoxicating floral-fruity aroma that you can smell from several feet away. The fragrance is sweet, complex, and distinctly tropical.

**Fake/Carbide-ripened:** Little to no aroma, or a faint chemical smell. Artificially ripened mangoes never develop the aromatic compounds that form during natural ripening.

*Pro tip: Ask the seller if you can smell the mango before buying. Real Alphonso doesn't need you to put it to your nose — the aroma reaches you.*

## 2. The Skin Color Pattern

**Real Alphonso:** Uneven ripening with patches of green, yellow, and orange. The shoulder (top) ripens first, creating a gradient. Natural sunspots and small brown freckles are common.

**Fake/Carbide-ripened:** Uniform bright yellow all over. Too perfect, too consistent. Carbide ripens the entire surface at once, eliminating the natural gradient.

## 3. The Shape and Size

**Real Alphonso:** Oval to oblong shape, slightly flat on the sides. Typically 150-300 grams depending on the grade (A1, A2, A3). Has a distinctive "beak" at the bottom.

**Fake varieties often sold as Alphonso:**
- Badami (more round, larger)
- Kesar (more yellow, different texture)
- Totapuri (more elongated, pointed)

## 4. The Texture Test

**Real Alphonso:** The skin is thin and delicate. When you press gently, it should give slightly if ripe but spring back. The flesh inside is completely fiber-free and buttery smooth.

**Fake/Carbide-ripened:** Often the skin remains firm even when the inside appears ripe. The flesh may have fibers or a grainy texture.

## 5. The Taste Profile

**Real Alphonso:** Complex sweetness with honey and citrus notes. No tartness or sourness. The aftertaste is clean and sweet, lingering pleasantly.

**Fake/Carbide-ripened:** One-dimensional sweetness or slight bitterness. May have a metallic aftertaste (a sign of carbide). The flavor doesn't linger.

## 6. Check the Source

**Genuine Alphonso only comes from:**
- Ratnagiri district
- Sindhudurg district  
- Raigad district
- Parts of Konkan region

If a seller can't tell you which specific region (or better, which village) the mangoes are from, be suspicious. At Aamrit, every box can be traced to the exact plot in our Ratnagiri or Raigad farms.

## 7. The Price Reality Check

**Real Alphonso (2026 prices):**
- Grade A1 (Premium): ₹1,200-1,800 per dozen
- Grade A2 (Classic): ₹800-1,200 per dozen
- Grade A3 (Budget): ₹500-800 per dozen

If someone is selling "Alphonso" for ₹300-400 per dozen, it's almost certainly not genuine Ratnagiri Alphonso. The cost of cultivation, natural ripening, and proper handling simply doesn't allow for such low prices.

## The GI Tag: Your Ultimate Guarantee

Alphonso mango has a **Geographical Indication (GI) tag** from the Government of India, meaning only mangoes grown in specific regions of Maharashtra can legally be called Alphonso. Look for:

- GI certification on the packaging
- Farm details and traceability information
- Direct farm-to-consumer brands like Aamrit

## Summary: Quick Checklist

✅ Strong floral aroma (smell from distance)
✅ Uneven color with natural gradient
✅ Oval shape with distinctive beak
✅ Fiber-free, buttery flesh
✅ Complex, lingering sweetness
✅ Traceable to Ratnagiri/Raigad/Sindhudurg
✅ Price matches market reality

When you find a mango that passes all these tests, you've found the real King of Mangoes. And trust us — once you've tasted genuine, naturally-ripened Alphonso, you'll never settle for anything less.

---

*Want guaranteed authentic Alphonso delivered to your door? [Shop our farm-fresh mangoes](/shop) — every fruit traceable to our 15,000+ trees across Ratnagiri and Raigad.*
    `,
  },
  "carbide-vs-natural-ripening": {
    slug: "carbide-vs-natural-ripening",
    title: "Carbide vs Natural Ripening: Why It Matters for Your Health",
    excerpt:
      "Discover the dangers of calcium carbide ripening and why our 5-7 day straw-cradle method produces healthier, tastier mangoes.",
    image: "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=1600&q=85",
    category: "Health",
    readTime: "7 min read",
    date: "April 10, 2026",
    metaDescription:
      "Learn about the health dangers of calcium carbide mango ripening vs traditional straw-cradle method. Why naturally ripened Alphonso is safer and tastier.",
    keywords: [
      "carbide ripening mango",
      "natural mango ripening",
      "calcium carbide dangers",
      "straw ripening method",
      "healthy mango",
    ],
    content: `
## The Hidden Danger in Your Mango Basket

Every summer, millions of Indians unknowingly consume mangoes ripened with **calcium carbide** — a chemical that's technically banned in India under the Food Safety and Standards Act, yet remains widely used because it ripens fruit overnight, saving traders time and money.

At Aamrit, we've never used carbide. Not once in our 18 years of farming. Here's why this matters for your health, and what we do instead.

## What is Calcium Carbide?

Calcium carbide (CaC₂) is an industrial chemical primarily used for welding. When it comes in contact with moisture, it releases **acetylene gas**, which artificially triggers the ripening process in fruits.

**The problem:** Acetylene gas is not the same as ethylene — the natural ripening hormone that fruits produce. And carbide often contains traces of **arsenic** and **phosphorus hydride**, both of which are toxic to humans.

## Health Risks of Carbide-Ripened Mangoes

### Immediate Effects
- Headaches and dizziness
- Nausea and vomiting
- Burning sensation in chest and abdomen
- Tingling in hands and feet

### Long-term Exposure
- Neurological damage
- Memory impairment
- Liver and kidney damage
- Potential carcinogenic effects (arsenic exposure)

A 2019 study published in the Journal of Food Science and Technology found detectable levels of arsenic in 34% of carbide-ripened mangoes tested across Indian markets.

## How to Spot Carbide-Ripened Mangoes

| Sign | Carbide-Ripened | Naturally Ripened |
|------|-----------------|-------------------|
| Color | Uniform yellow | Patchy, gradient |
| Aroma | None or chemical | Strong, floral |
| Skin | Firm, waxy | Soft, natural |
| Taste | Flat, sometimes bitter | Complex, honey-sweet |
| Shelf life | Rots quickly | Lasts 4-5 days |

## The Aamrit Way: Traditional Straw-Cradle Ripening

Our ripening method hasn't changed in 100 years. Here's exactly what we do:

### Step 1: Harvest at Peak Maturity
We pick mangoes when they're "mature green" — physiologically ready to ripen but still firm. This happens 100-110 days after flowering, usually in late April.

### Step 2: The Straw Cradle
Each mango is placed in a wooden crate lined with rice straw. The straw:
- Cushions the fruit (no bruising)
- Absorbs excess moisture
- Creates a microclimate for even ripening
- Allows natural ethylene gas to circulate

### Step 3: 5-7 Days of Patience
The mangoes sit in a cool, well-ventilated room (not refrigerated) for 5-7 days. Our farm team inspects them daily, removing any that show signs of damage.

### Step 4: The Aroma Test
We know a mango is ready when you can smell it from across the room. That intoxicating floral fragrance? It only develops during natural ripening.

## Why Natural Ripening Tastes Better

During natural ripening, the mango undergoes a complex biochemical transformation:

1. **Starch converts to sugar** — creating sweetness
2. **Acids break down** — removing tartness
3. **Aromatic compounds form** — creating the signature fragrance
4. **Pectin softens** — creating buttery texture
5. **Carotenoids develop** — creating the golden color

Carbide ripening forces the color change and softening but **skips the flavor development**. That's why artificially ripened mangoes look ripe but taste disappointing.

## The Economics of Doing It Right

Natural ripening costs us 30% more than carbide would:
- We need more storage space
- We hold inventory for 5-7 days instead of overnight
- We lose some fruit to natural spoilage
- We can't buy unripe fruit cheaply from auctions

But here's the thing: **we're not in the business of selling yellow fruit. We're in the business of selling the Alphonso experience** — and that experience only comes from mangoes ripened the way nature intended.

## How to Ensure You're Getting Naturally Ripened Mangoes

1. **Buy from traceable sources** — If they can't tell you which farm, be suspicious
2. **Use the aroma test** — Real ripe Alphonso smells incredible
3. **Check the color** — Natural ripening creates uneven coloring
4. **Ask about the process** — Legitimate sellers are proud of their methods
5. **Pay fair prices** — Quality natural ripening can't be done cheaply

## Our Promise

Every mango from Aamrit is:
- ✅ Ripened naturally in straw-lined crates
- ✅ Never touched by carbide, ethylene gas, or any chemical
- ✅ Traceable to our farms in Ratnagiri and Raigad
- ✅ Inspected daily by our farm team
- ✅ Dispatched within 24 hours of reaching optimal ripeness

The 5-7 day wait is worth it. Your health is worth it. And trust us — the taste difference is worth it.

---

*Experience the difference of naturally ripened Alphonso. [Order from our farm](/shop) and taste what mangoes are supposed to taste like.*
    `,
  },
  "alphonso-mango-health-benefits": {
    slug: "alphonso-mango-health-benefits",
    title: "10 Surprising Health Benefits of Alphonso Mangoes",
    excerpt:
      "From boosting immunity to improving digestion, discover why the 'King of Mangoes' is also a superfood.",
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1600&q=85",
    category: "Health",
    readTime: "6 min read",
    date: "April 5, 2026",
    metaDescription:
      "Discover 10 health benefits of Alphonso mangoes including immunity boost, better digestion, and skin health. Learn why Hapus mango is a superfood.",
    keywords: [
      "alphonso mango benefits",
      "hapus mango nutrition",
      "mango health benefits",
      "mango vitamins",
      "mango superfood",
    ],
    content: `
## The King of Mangoes is Also a Superfood

Alphonso mango isn't just the world's most delicious mango — it's also packed with nutrients that make it a genuine superfood. Here are 10 science-backed health benefits of eating naturally ripened Alphonso.

## 1. Immunity Powerhouse

One medium Alphonso mango provides:
- **67% of daily Vitamin C** — Essential for immune function
- **10% of daily Vitamin A** — Supports immune cell production
- High in beta-carotene — A powerful antioxidant

During mango season, regular consumption can significantly boost your body's defense against infections.

## 2. Digestive Health Champion

Alphonso mangoes contain:
- **Digestive enzymes (amylases)** — Break down complex carbs
- **Dietary fiber** — Promotes regular bowel movements
- **Water content (83%)** — Keeps you hydrated

The fiber in mangoes also acts as a prebiotic, feeding the good bacteria in your gut.

## 3. Eye Health Protection

The vibrant orange color of Alphonso comes from:
- **Beta-carotene** — Converts to Vitamin A for vision
- **Lutein and zeaxanthin** — Protect against blue light damage
- **Vitamin A** — Prevents night blindness

Regular mango consumption is linked to reduced risk of age-related macular degeneration.

## 4. Heart Health Support

Studies show that mangoes may help:
- **Lower cholesterol** — Thanks to pectin fiber
- **Reduce blood pressure** — Potassium content helps
- **Decrease inflammation** — Polyphenols are anti-inflammatory

The mangiferin compound found in mangoes has shown cardioprotective effects in research.

## 5. Skin and Hair Nourishment

Alphonso provides nutrients essential for beauty:
- **Vitamin C** — Collagen production for firm skin
- **Vitamin A** — Skin cell regeneration
- **Vitamin E** — Protects against UV damage
- **Copper** — Maintains hair color

Many traditional Ayurvedic beauty treatments use mango for skin health.

## 6. Brain Function Enhancement

Mangoes support cognitive health through:
- **Vitamin B6** — Neurotransmitter production
- **Glutamine acid** — Memory and concentration
- **Iron** — Oxygen delivery to the brain

The natural sugars in mango provide quick energy for mental tasks.

## 7. Cancer-Fighting Properties

Research has identified several anti-cancer compounds in mangoes:
- **Mangiferin** — Shown to inhibit cancer cell growth
- **Quercetin** — Anti-tumor properties
- **Gallic acid** — Protective against colon cancer
- **Fisetin** — May slow cancer spread

Note: These are preventive benefits; mangoes are not a cancer treatment.

## 8. Alkalizes the Body

Despite being sweet, mangoes have an alkalizing effect:
- **Contains malic acid, tartaric acid, and citric acid**
- These acids help maintain the body's pH balance
- Alkaline environments may reduce inflammation

## 9. Anemia Prevention

Alphonso mangoes are beneficial for:
- **Iron content** — Essential for hemoglobin
- **Vitamin C** — Enhances iron absorption
- **Copper** — Supports red blood cell production

Pregnant women in India have traditionally eaten mangoes to prevent anemia.

## 10. Natural Stress Relief

Mangoes can help you relax through:
- **Magnesium** — Natural relaxant
- **B vitamins** — Support nervous system
- **Tryptophan** — Precursor to serotonin (mood hormone)

Plus, the act of eating a delicious mango is naturally mood-boosting!

## Nutritional Profile (per 100g of Alphonso)

| Nutrient | Amount | % Daily Value |
|----------|--------|---------------|
| Calories | 60 kcal | 3% |
| Carbohydrates | 15g | 5% |
| Fiber | 1.6g | 6% |
| Vitamin C | 36mg | 40% |
| Vitamin A | 54μg | 6% |
| Folate | 43μg | 11% |
| Potassium | 168mg | 4% |
| Magnesium | 10mg | 2% |

## Best Practices for Maximum Benefits

1. **Eat ripe mangoes** — Nutrient content peaks at full ripeness
2. **Don't refrigerate before ripening** — Kills nutrient development
3. **Eat the skin** — Contains additional fiber and nutrients (wash well)
4. **Pair with protein** — Balances blood sugar response
5. **Choose naturally ripened** — Carbide-ripened mangoes have fewer nutrients

## When to Eat Mangoes

- **Best time:** Morning or afternoon (not late night)
- **Ideal portion:** 1-2 mangoes per day
- **For weight management:** Eat as a snack, not after meals

## The Aamrit Advantage

Our naturally ripened Alphonso develops its full nutritional potential because:
- 5-7 day slow ripening allows complete nutrient formation
- No chemicals interfere with natural processes
- Fresh delivery means nutrients haven't degraded
- Traceable source ensures genuine Alphonso quality

---

*Ready to enjoy the healthiest mangoes? [Shop our farm-fresh Alphonso](/shop) — naturally ripened for maximum nutrition and taste.*
    `,
  },
  "ratnagiri-vs-devgad-alphonso": {
    slug: "ratnagiri-vs-devgad-alphonso",
    title: "Ratnagiri vs Devgad Alphonso: What's the Real Difference?",
    excerpt:
      "Both regions produce GI-tagged Alphonso, but subtle differences exist. Here's what to know.",
    image: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=1600&q=85",
    category: "Guide",
    readTime: "4 min read",
    date: "March 28, 2026",
    metaDescription:
      "Compare Ratnagiri and Devgad Alphonso mangoes. Learn about flavor differences, terroir, and which region produces the best Hapus.",
    keywords: [
      "ratnagiri alphonso",
      "devgad alphonso",
      "best alphonso region",
      "hapus comparison",
      "konkan mango regions",
    ],
    content: `
## The Great Alphonso Debate

Ask any mango lover in India which Alphonso is best, and you'll start a passionate debate. Ratnagiri and Devgad are the two most famous regions for Alphonso, both covered under the GI (Geographical Indication) tag. But is there really a difference?

As farmers who grow Alphonso in Ratnagiri (and neighboring Raigad), here's our honest take.

## The Geography

### Ratnagiri
- **Location:** Central Konkan coast, Maharashtra
- **Terrain:** Hilly, with red lateritic soil
- **Climate:** Hot and humid, strong sea breeze
- **Our farms:** 150+ acres across multiple villages

### Devgad
- **Location:** Southern Konkan, Sindhudurg district
- **Terrain:** Coastal with similar lateritic soil
- **Climate:** Slightly cooler due to location
- **Known for:** Smaller, more concentrated production area

## The Taste Difference (Honest Assessment)

Here's the truth that many sellers won't tell you: **the differences are subtle**, and both regions produce excellent Alphonso when grown and ripened properly.

That said, some distinctions exist:

| Factor | Ratnagiri | Devgad |
|--------|-----------|--------|
| Sweetness | High, honey notes | High, slightly more sugar |
| Aroma | Intense floral | Strong, slightly different notes |
| Size | Medium to large | Often slightly smaller |
| Texture | Creamy, smooth | Creamy, smooth |
| Color | Golden yellow | Golden with orange tinge |

**Our opinion:** The variation within each region (due to specific microclimate, tree age, and farming practices) is often greater than the variation between regions.

## What Actually Matters More Than Region

### 1. The Specific Farm
A well-maintained orchard in Ratnagiri will produce better mangoes than a neglected one in Devgad, and vice versa. Ask about:
- Tree age (older trees often produce more flavorful fruit)
- Farming practices (organic vs chemical)
- Harvest timing (precision matters)

### 2. The Ripening Method
This is the biggest factor in taste. Carbide-ripened Alphonso from Devgad will taste worse than naturally-ripened Alphonso from Ratnagiri (or anywhere).

### 3. The Freshness
Mangoes degrade quickly after ripening. A fresh Ratnagiri mango beats a week-old Devgad mango every time.

### 4. The Grade
Within any region, A1 grade mangoes are premium, A2 are family favorites, and A3 are budget-friendly. Grade matters more than region for most consumers.

## The Marketing Reality

Some uncomfortable truths:
- Many "Devgad Alphonso" boxes contain mixed regional fruit
- The Devgad name commands a premium (sometimes unfairly)
- Both regions have excellent and mediocre producers
- Labels can be misleading without proper traceability

## Our Approach at Aamrit

We grow our Alphonso in **Ratnagiri and Raigad** districts. We don't claim to be "better than Devgad" — we claim to be:

1. **Traceable** — Every box links to a specific plot
2. **Naturally ripened** — 5-7 day straw method
3. **Honestly graded** — A1, A2, A3 clearly labeled
4. **Fresh** — Dispatched within 24 hours of ripening

Whether Ratnagiri or Devgad, what matters is the care taken at every step — from the orchard to your table.

## How to Choose

1. **Don't buy based on region name alone** — It's often marketing
2. **Ask about the farm** — Traceability is key
3. **Confirm ripening method** — Natural only
4. **Check the grade** — Know what you're paying for
5. **Buy from producers, not traders** — Direct relationships mean better quality

## The Bottom Line

Both Ratnagiri and Devgad produce world-class Alphonso. The differences between a good producer and a bad one within any region far outweigh the differences between regions.

Focus on:
- ✅ Natural ripening
- ✅ Traceability
- ✅ Freshness
- ✅ Honest grading

Rather than:
- ❌ Region name alone
- ❌ Fancy packaging
- ❌ Marketing claims

---

*Experience authentic Ratnagiri and Raigad Alphonso from our family farms. [Shop now](/shop) — every mango traceable to its source.*
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) return { title: "Post not found — Aamrit" };

  return {
    title: `${post.title} | Aamrit Blog`,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  if (!post) notFound();

  const otherPosts = Object.values(BLOG_POSTS).filter(p => p.slug !== slug).slice(0, 2);

  return (
    <>
      <ShopNav />
      <main className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50 pb-24">
        {/* Hero */}
        <div className="relative h-[55vh] min-h-[450px] max-h-[600px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
          
          {/* Back button */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All articles
              </Link>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                  post.category === 'Health' 
                    ? 'bg-leaf text-white' 
                    : 'bg-white text-saffron'
                }`}>
                  {post.category}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-xs font-medium">
                  {post.readTime}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight">
                {post.title}
              </h1>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-saffron flex items-center justify-center ring-2 ring-white/30">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Aamrit Team</p>
                    <p className="text-white/60 text-xs">{post.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="relative">
          {/* Floating share sidebar - desktop only */}
          <div className="hidden lg:block absolute left-8 top-12 w-12">
            <div className="sticky top-32 flex flex-col items-center gap-3">
              <span className="text-[10px] text-charcoal/40 uppercase tracking-wider mb-1">Share</span>
              <button className="w-10 h-10 rounded-full bg-white shadow-e1 flex items-center justify-center text-charcoal/60 hover:text-saffron hover:shadow-e2 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white shadow-e1 flex items-center justify-center text-charcoal/60 hover:text-saffron hover:shadow-e2 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white shadow-e1 flex items-center justify-center text-charcoal/60 hover:text-leaf hover:shadow-e2 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Article intro */}
            <p className="text-xl sm:text-2xl text-charcoal/80 leading-relaxed font-light border-l-4 border-gold pl-6 mb-12">
              {post.excerpt}
            </p>
            
            <div
              className="prose prose-lg prose-charcoal max-w-none
                prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-cream-200
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-charcoal/75 prose-p:leading-[1.8] prose-p:mb-6
                prose-a:text-saffron prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                prose-strong:text-charcoal prose-strong:font-semibold
                prose-ul:text-charcoal/75 prose-ol:text-charcoal/75 prose-ul:my-6 prose-ol:my-6
                prose-li:my-2 prose-li:leading-relaxed
                prose-li:marker:text-gold
                prose-table:text-sm prose-table:border prose-table:border-cream-200 prose-table:rounded-xl prose-table:overflow-hidden
                prose-th:bg-cream-100 prose-th:text-charcoal prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left
                prose-td:px-4 prose-td:py-3 prose-td:border-cream-200
                prose-blockquote:border-l-4 prose-blockquote:border-gold prose-blockquote:bg-cream-50 prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-charcoal/80
                prose-hr:border-cream-200 prose-hr:my-12"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-cream-200">
              <p className="text-xs text-charcoal/40 uppercase tracking-wider mb-3">Related Topics</p>
              <div className="flex flex-wrap gap-2">
                {post.keywords.slice(0, 5).map((keyword) => (
                  <span key={keyword} className="px-3 py-1.5 rounded-full bg-cream-100 text-charcoal/60 text-xs font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 relative p-8 sm:p-10 rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-100 via-cream-50 to-gold-50" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
              <div className="relative text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-saffron text-xs font-semibold mb-4 shadow-sm">
                  Shop Now
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                  Ready to Taste Real Alphonso?
                </h3>
                <p className="mt-3 text-charcoal/60 max-w-md mx-auto">
                  Farm-fresh, naturally ripened, delivered free across India. Every mango traceable to our farms.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-[1.02] transition-all"
                >
                  Shop Mangoes
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>
        
        {/* Related articles */}
        {otherPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cream-200">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-8">More Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex gap-5 p-4 rounded-2xl bg-white shadow-e1 hover:shadow-e2 transition-all"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2 ${
                      relatedPost.category === 'Health' 
                        ? 'bg-leaf/10 text-leaf' 
                        : 'bg-saffron/10 text-saffron'
                    }`}>
                      {relatedPost.category}
                    </span>
                    <h3 className="font-serif text-lg text-charcoal group-hover:text-saffron transition-colors leading-snug line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-2 text-charcoal/50 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\| (.*) \|$/gim, (match) => {
      const cells = match.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => c.match(/^-+$/))) return '';
      const isHeader = !match.includes('---');
      const tag = isHeader ? 'th' : 'td';
      return `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>[\s\S]*<tr>.*<\/tr>)/gim, '<table>$1</table>')
    .replace(/^(?!<[huplota])(.*$)/gim, (match) => match.trim() ? `<p>${match}</p>` : '')
    .replace(/\n\n/g, '')
    .replace(/✅/g, '<span class="text-leaf">✅</span>')
    .replace(/❌/g, '<span class="text-red-500">❌</span>');
}
