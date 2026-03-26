# Vernix Unit Economics

Customer acquisition costs, lifetime value, and conversion funnel model.

All numbers based on the [pricing model](./pricing.md) with Pro at $29/mo, $30 credit, wake-on-demand voice at $1.40/hr, silent at $0.71/hr.

---

## Conversion Funnel

Conservative estimates based on typical B2B SaaS freemium benchmarks.

| Stage                | Monthly volume | Rate |
| -------------------- | -------------- | ---- |
| Landing page visits  | 5,000          | —    |
| Free signups         | 150            | 3.0% |
| Start trial          | 75             | 50%  |
| Use product in trial | 40             | 53%  |
| Convert to Pro       | 8              | 20%  |

**End-to-end: 0.16% of visits become Pro users.**

Typical SaaS benchmarks for comparison:
- Visitor → signup: 2–5% (we use 3%)
- Signup → trial activation: 40–60% (we use 50%)
- Trial → meaningful use: 40–60% (we use 53%)
- Trial → paid: 15–25% (we use 20%)

---

## Cost Per Acquisition

### Organic (no ad spend)

Free users and trialists cost us money before they ever pay.

| Cost driver                        | Monthly  |
| ---------------------------------- | -------- |
| Active free users (75 × $0.21)     | $16      |
| Free RAG chat cost (~20 heavy users × $3/mo) | $60 |
| Trial users (75 × $1.06)           | $80      |
| **Total organic acquisition cost** | **$156** |
| New Pro conversions                 | 8        |
| **Organic CAC**                    | **$20**  |

*75 active free users = 150 signups × 50% active rate. 75 trialists = all signups auto-start trial. Free RAG cost assumes ~20 users max out 20 queries/day regularly at $0.01/query — most won't, but some will.*

Trial cost dominates — each trialist costs $1.06 (~30 min voice + ~30 min silent on average over the 90 min trial). Free tier RAG chat is the second biggest cost if users are active chatters.

### With paid acquisition

| Monthly ad spend | Organic cost | Total cost | Additional visits | Additional Pro users | Total Pro | Blended CAC |
| ---------------- | ------------ | ---------- | ----------------- | -------------------- | --------- | ----------- |
| $0               | $156         | $156       | —                 | —                    | 8         | $20         |
| $1,000           | $156         | $1,156     | 333               | 1                    | 9         | $128        |
| $3,000           | $156         | $3,156     | 1,000             | 2                    | 10        | $316        |

**B2B SaaS CPC is $3–8.** At $3/click, $1,000 buys 333 visits → 0.53 Pro users at 0.16% conversion. Paid acquisition is expensive at our current conversion rates. Realistically, ad spend only makes sense after optimizing the organic funnel.

To make paid ads work at 3:1 LTV:CAC, we need either:
- CPC under $1 (social/content marketing, not search ads)
- Higher conversion rate (better landing page, onboarding)
- Both

---

## Lifetime Value

Based on the 1,000-user scenario from the pricing model.

| Metric                 | Conservative | Optimistic |
| ---------------------- | ------------ | ---------- |
| Monthly churn          | 8%           | 5%         |
| Average lifetime       | 12 months    | 20 months  |

**Revenue split by user type:**

| User type  | % of Pro users | Monthly revenue  | Monthly COGS |
| ---------- | -------------- | ---------------- | ------------ |
| Light      | 45%            | $29 (no overage) | $3.53        |
| Typical    | 35%            | $29 (no overage) | $11.30       |
| Heavy      | 15%            | $59 (with overage)| $28.95      |
| Very heavy | 5%             | $147 (with overage)| $70.50     |

**Median Pro user (light/typical, 80% of users):** pays $29/mo flat, no overage.
- Median LTV margin (conservative, 12 mo): ($29 - $1.56 Polar - $7.42 avg COGS) × 12 = **$240**
- Median LTV margin (optimistic, 20 mo): **$400**

**Mean across all Pro users:** $39.73 revenue, $16.30 COGS, $1.56+ Polar = $21.87 margin/mo.
- Mean LTV margin (conservative, 12 mo): **$262**
- Mean LTV margin (optimistic, 20 mo): **$437**

*Use median for CAC decisions (what most users are worth). Use mean for total business projections.*

---

## LTV:CAC

3:1 is the standard SaaS benchmark for healthy unit economics.

| Scenario     | CAC  | LTV (median) | Ratio  | Verdict              |
| ------------ | ---- | ------------ | ------ | -------------------- |
| Organic only | $20  | $240         | 12.0:1 | Excellent            |
| +$1,000 ads  | $128 | $240         | 1.9:1  | Unprofitable         |

**Organic is excellent. Paid ads don't work at current conversion rates.** The 0.16% visit-to-Pro rate makes paid traffic too expensive. Focus on organic growth and funnel optimization before spending on ads.

**To make $1,000/mo ads viable (3:1 ratio):**
- Need CPC ≤ $1 AND visit-to-Pro rate ≥ 0.5%
- Or: content marketing / referrals with near-zero CPC

---

## CAC Payback Period

| Scenario | CAC | Monthly margin (median) | Payback   |
| -------- | --- | ----------------------- | --------- |
| Organic  | $20 | $20                     | 1 month   |

SaaS benchmark: payback under 12 months is healthy. Under 6 months is strong. Organic payback is essentially instant.

---

## Levers to Improve Economics

**Improve conversion (highest impact):**
- Visitor → signup: better landing page, social proof, demo video
- Signup → trial: reduce friction in first meeting setup, auto-join demo meeting
- Trial → paid: in-trial upgrade prompts, usage alerts near trial end, show value ("You saved X hours")

**Reduce CAC:**
- Tighten free tier RAG limit if abuse detected (20/day → 10/day)
- Shorten trial from 14 → 7 days if data shows most decisions happen in first week
- Cap trial minutes lower (currently 90 min — could test 60 min)
- Block disposable email domains from trial signup

**Increase LTV:**
- Reduce churn (better product, engagement emails, usage insights)
- Increase ARPU (users naturally grow into heavier usage over time)
- Annual plans lock in 12 months ($24/mo vs $29 — better retention, lower Polar fees)

**Unlock paid acquisition:**
- Content marketing and SEO (near-zero CPC)
- Referral program (existing users invite colleagues)
- Product-led viral loops (meeting participants see Vernix in action)
