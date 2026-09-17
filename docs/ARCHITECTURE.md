# SupplyWeave: Architecture and Design

Status: design for approval. Nothing has been built. No package.json, source files, git repository, or deployment exist yet. This document is the complete plan for the SupplyWeave explanatory prototype described in `docs/follow-up-prompt.md` (the revised product model). The earlier brief in `docs/master-prompt.md` is superseded wherever the two disagree; its still-valid rules (design language, accessibility, deterministic local simulation, no paid services) are carried forward.

Product name: SupplyWeave. It is not an AI product and the site never describes it as one.

## 1 Summary

What will be built: a one-page static website that explains SupplyWeave, a private production run utilization network, through an interactive deterministic simulation of one compatible production window. Buyers see how a standing requirement is privately matched to a manufacturer's approved incremental capacity, compare their current delivered cost with the SupplyWeave delivered cost, commit a simulated order, and watch matched volume move from 35,000 to 55,000 units. Suppliers see how a private production window is created and how a consolidated supplemental order comes back.

What will not be built: live payments, contracts, capacity verification, freight, credit, optimization, compatibility certification, any backend, any analytics, any paid or third-party runtime service.

Approval gate: the user reviews this document, confirms the decisions in section 22, then says go. Only then does implementation start, in the phase order of section 20.

## 2 Comprehension goals

Five-second test (hero only): a visitor understands that manufacturers have scheduled production runs with spare compatible capacity, smaller buyers have recurring orders too small for production-scale pricing, and SupplyWeave privately matches the two before the run's cutoff.

Thirty-second test (hero plus problem section plus a glance at the demo): the visitor can name the input (a standing requirement with quantity, destination, maximum delivered price, fill rule), the output (a private opportunity with a delivered price, savings against baseline, delivery window, production status), and the condition for execution (supplier economics and buyer constraints both satisfied before the cutoff).

How the page passes: the hero is one headline, one sentence, one action. The problem section is two short columns (stranded capacity, fragmented demand) that become two stacked steps on mobile. The demo separates "what you do" from "what SupplyWeave does" at every stage with lane labels, not color.

## 3 Stack and tooling decisions

| Area | Decision | Rationale | Rejected |
| --- | --- | --- | --- |
| Framework | React 19, TypeScript ~5.8 | Blank repo rule from the original brief; matches the user's sibling projects | Preact, vanilla TS |
| Build | Vite 6, `base: './'`, `@` alias to `src` | Sibling convention; relative base works on any GitHub Pages subpath | Next.js |
| Styling | Plain CSS: `tokens.css` custom properties, `base.css`, one CSS Module per component | Clean CSS was requested; modules give local scope with no runtime or plugin | Tailwind (sibling projects use it; decision 22.4 lets the user override) |
| Fonts | System UI stack with tabular numerals on all figures | No external requests, instant render | Google Fonts (third-party request), self-hosted Inter (decision 22.3) |
| Icons | Eight inline SVG symbols in `Icon.tsx`, always next to text | No icon library needed for eight glyphs | lucide-react |
| State | Hand-written reducer over a `DemoState` discriminated union, one React context | Small explicit state machine; testable without React | XState, Redux |
| Numbers | Integer arithmetic in ten-thousandths of a dollar (`Money4`) | The demo needs four decimals (0.3375, 0.0075) with no float drift | Floats, decimal.js |
| Demo clock | Fixed illustrative "today" in fixtures, never `Date.now()` | Determinism; "cutoff in three days" must always be three days | Real clock |
| Testing | Vitest 3, jsdom, Testing Library (react, user-event, jest-dom) | Sibling convention | Jest, Playwright (deferred) |
| Lint | ESLint 9 flat config, typescript-eslint, react-hooks, react-refresh, jsx-a11y | Sibling convention plus jsx-a11y for label and ARIA checks | Prettier (optional) |
| Deploy | GitHub Actions: lint, test, build on Node 20, deploy `dist` to Pages | Zero cost, proven in siblings | Netlify, Vercel |
| Persistence | None by default; optional localStorage only for the "show results immediately" preference | Brief allows harmless preferences; nothing else is worth persisting | Persisting scenario or form state |

Scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `lint`, `test`, `test:watch`, `typecheck`.

Planned packages (not installed): react, react-dom; dev: vite, @vitejs/plugin-react, typescript, vitest, jsdom, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh, eslint-plugin-jsx-a11y, globals, @types/react, @types/react-dom, @types/node.

## 4 Repository and folder structure

```
supplyweave/
  .github/workflows/deploy.yml     lint, test, build, deploy to Pages
  docs/                            master-prompt.md, follow-up-prompt.md, ARCHITECTURE.md
  public/favicon.svg
  index.html                       title "SupplyWeave", description meta, lang="en"
  package.json  vite.config.ts  vitest.config.ts  eslint.config.js
  tsconfig.json  tsconfig.app.json  tsconfig.node.json
  README.md                        what it is, how to run, demo numbers, limitations
  src/
    main.tsx  App.tsx              App renders the ten sections in order inside DemoProvider
    styles/tokens.css  base.css
    domain/                        pure TypeScript, no React
      types.ts                     all models in section 10
      money.ts                     Money4 helpers: add, mul, pct, format
      compatibility.ts             assess(requirement, window) -> CompatibilityAssessment
      pricing.ts                   breakdown(requirement, window) -> DeliveredCostBreakdown
      matching.ts                  evaluate(requirement, window, clock) -> MatchedOpportunity | NoMatch
      engine.ts                    commit(...) -> Commitment + FulfillmentState; runs the stage list
      __tests__/
    data/                          typed fixtures, all labeled illustrative
      product.ts  productionWindow.ts  buyerRequirement.ts  standingDemand.ts
      scenarios.ts                 the eight scenarios as input deltas
      scope.ts                     recommendedDirection, pilotHypotheses, openQuestions,
                                   mvpBoundaries, futureIdeas, demoAssumptions (separate arrays)
      roadmap.ts  businessModel.ts  compatibilityExamples.ts  copy.ts
    state/
      demoReducer.ts  events.ts  DemoProvider.tsx  useDemo.ts  __tests__/
    hooks/useReducedMotion.ts
    components/
      ui/      Section, Button, Field, StatusLabel, Disclosure, DataTable, LiveRegion, Icon, LaneLabel
      sections/
        Hero/  Problem/  UserSystemFlow/  CompatibilityExplainer/  Roadmap/
        BusinessModel/  ScopeStatus/  Closing/
        BuyerMatchDemo/   ScenarioSelector, RequirementForm, MatchingFields, OpportunityPanel,
                          WhyThisMatches, CostComparison, PriceBreakdown, CommitmentTerms,
                          ProcessingSteps, MatchedVolume, ResultPanel, DemoAssumptionsNote
        SupplierWindow/   WindowForm, WindowResults, OpportunityControls
```

Rule: `domain/` and `data/` import nothing from React. `components/` never compute money; they render values the reducer already derived.

## 5 Information architecture

One page, ten sections in this order. Each has an `id` for in-page links and an `h2`.

| # | Section | Purpose | Key content |
| --- | --- | --- | --- |
| 1 | Hero | Product definition in five seconds | h1 "Fill compatible production capacity with committed demand." Sentence: "SupplyWeave privately matches a manufacturer's scheduled production run with smaller buyers' standing orders, so the run fills and the buyer gets production-scale pricing without meeting the whole minimum alone." Primary button "See how a match works" scrolls to section 3. Secondary text link "I'm a manufacturer" scrolls to section 4. |
| 2 | Problem | Stranded capacity and fragmented demand | Two columns: "A manufacturer has a run that could take more" and "A buyer has an order too small to earn the best economics", then one line: "Today neither side has a simple way to find the other, check the economics, and commit before the cutoff." |
| 3 | Buyer match demo | Centerpiece simulation | Section 7 state machine; two lanes "You" and "SupplyWeave" |
| 4 | Supplier production window | Supplier side of the same run | Window form, results, approve/decline/modify controls |
| 5 | Buyer vs SupplyWeave | Two-lane scannable flow | Buyer: Save requirement, Review opportunity, Compare cost, Commit, Track. SupplyWeave: Store requirement privately, Search compatible windows, Compute delivered cost, Check both sides' constraints, Confirm and track production. |
| 6 | Compatibility | Full, partial, false | Three-column explainer with the corrugated example; stacked on mobile |
| 7 | Roadmap | Software first, network second | Phase 1, Phase 2 (both in the demo), Phase 3 labeled "Future, not in this prototype" |
| 8 | Business model | Working hypotheses | Three rows, each labeled "Working hypothesis" |
| 9 | Scope | Recommended direction, pilot hypotheses, open questions, MVP boundaries, demo assumptions | Five distinctly labeled groups from five separate arrays |
| 10 | Closing | Why it matters | Four sentences, link back to the demo |

No slogans, testimonials, logos, blog, or decorative statistics anywhere.

## 6 Component map

Presentation components receive derived values as props from the reducer through `useDemo()`. None compute prices.

| Component | Responsibility | Reads | Writes (events) | Accessibility |
| --- | --- | --- | --- | --- |
| Section | `<section>` with `h2`, id, max-width | | | Heading order h1 > h2 > h3 |
| LaneLabel | Renders "You" or "SupplyWeave" lane heading with a shape glyph | | | Text plus shape, never color only |
| StatusLabel | Word plus shape plus color for every state | | | See 15.7 |
| Field | Label, input, help text, error text, `aria-describedby` | | | Every input labeled |
| Disclosure | `<details>`-style expandable with a button, keyboard native | | | No hover dependence |
| DataTable | Real `<table>` with caption; stacks to definition list under 640 px | | | |
| LiveRegion | Single polite live region for demo announcements | `announcement` | | `aria-live="polite"` |
| ScenarioSelector | Radio group of the eight scenarios | `scenarioId` | `SELECT_SCENARIO` | Fieldset with legend |
| RequirementForm | Standing requirement fields | `requirement`, `errors` | `EDIT_FIELD`, `SAVE_REQUIREMENT` | Validation errors inline and announced |
| MatchingFields | Shows exactly which fields are used to match | `requirement` | | Static list |
| OpportunityPanel | The private opportunity: window summary, units, cutoff, lane label "SupplyWeave found" | `opportunity` | | |
| WhyThisMatches | Compatibility assessment as a short list | `opportunity.assessment` | | Word "Supplier approved demo data" always visible |
| CostComparison | Baseline vs SupplyWeave delivered price and savings | `breakdown`, `savings` | | Table, not a chart |
| PriceBreakdown | Expandable product, freight and handling, fee, total | `breakdown` | | Disclosure |
| CommitmentTerms | Timing, quantity, cancellation, quality assumptions | `terms` | | Each line labeled "Demo assumption" where applicable |
| ProcessingSteps | The eight stages with Waiting / Running / Done / Blocked | `stages` | | Announced via LiveRegion |
| MatchedVolume | 35,000 to 55,000 count-up, capacity bar with text | `window.committed`, `window.approved` | | Numbers in text; bar has `aria-hidden` |
| ResultPanel | Final price, total, savings, delivery window, production status | `result` | `RESET` | Focus moves here on completion |
| WindowForm | Supplier window creation | `windowDraft` | `EDIT_WINDOW_FIELD`, `SAVE_WINDOW` | Confidential fields marked "Private to you" |
| WindowResults | Compatible demand found, matched buyers, units, revenue, consolidated order, manifest | `supplierResults` | | Buyer identities shown as "Buyer A" etc. |
| OpportunityControls | Approve, Decline, Modify | | `SUPPLIER_APPROVE`, `SUPPLIER_DECLINE`, `SUPPLIER_MODIFY` | Buttons, confirmation text after action |
| UserSystemFlow, CompatibilityExplainer, Roadmap, BusinessModel, ScopeStatus, Closing | Static explanatory sections from `data/` | fixtures | | Semantic lists and tables |

## 7 Demo state machine

One reducer, two slices: `buyer` (the demo) and `supplier` (the window view). Supplier actions feed buyer scenario 7.

Buyer states (discriminated union on `status`):

| State | Meaning | Visible |
| --- | --- | --- |
| `requirement` | Editing or reviewing the standing requirement | RequirementForm, MatchingFields |
| `searching` | Loading state while SupplyWeave "searches" | Lane "SupplyWeave": "Searching compatible production windows" (700 ms, or instant under reduced motion) |
| `no_match` | Empty state, nothing compatible | Explanation of why, link to compatibility section |
| `opportunity` | Private opportunity presented | OpportunityPanel, WhyThisMatches, CostComparison, PriceBreakdown, CommitmentTerms, Commit button |
| `awaiting_supplier` | Partial compatibility needs supplier confirmation | Same panel, commit disabled, status "Awaiting supplier confirmation" |
| `committing` | Stages running | ProcessingSteps, MatchedVolume |
| `executed` | Success | ResultPanel with production status |
| `not_executed` | Blocked with reason (`price_limit`, `full_fill`, `cutoff_expired`, `supplier_declined`) | ResultPanel variant, stage marked Blocked |
| `modified` | Supplier changed terms; buyer must re-review | OpportunityPanel with a "Terms changed" notice, diff of changed fields |

Events: `SELECT_SCENARIO`, `EDIT_FIELD`, `SAVE_REQUIREMENT`, `SEARCH_DONE` (timer or immediate), `COMMIT`, `STAGE_ADVANCE`, `RESET`, `SUPPLIER_APPROVE`, `SUPPLIER_DECLINE`, `SUPPLIER_MODIFY`, `SET_IMMEDIATE_RESULTS`.

Transitions and guards:

| From | Event | Guard | To |
| --- | --- | --- | --- |
| any | `SELECT_SCENARIO` | | `requirement` with that scenario's inputs |
| any | `RESET` | | `requirement` with default scenario |
| `requirement` | `SAVE_REQUIREMENT` | validation passes | `searching` |
| `requirement` | `SAVE_REQUIREMENT` | validation fails | `requirement` with `errors` |
| `searching` | `SEARCH_DONE` | assessment is `false` | `no_match` |
| `searching` | `SEARCH_DONE` | cutoff expired | `not_executed(cutoff_expired)` |
| `searching` | `SEARCH_DONE` | assessment `partial` | `awaiting_supplier` |
| `searching` | `SEARCH_DONE` | assessment `full` | `opportunity` |
| `opportunity` | `COMMIT` | | `committing` (stage 1 Running) |
| `committing` | `STAGE_ADVANCE` | stage passes and more remain | `committing` (next stage) |
| `committing` | `STAGE_ADVANCE` | stage fails | `not_executed(reason)` |
| `committing` | `STAGE_ADVANCE` | last stage passes | `executed` |
| `opportunity` or `executed` | `SUPPLIER_DECLINE` | | `not_executed(supplier_declined)` |
| `opportunity` | `SUPPLIER_MODIFY` | | `modified` |
| `modified` | `COMMIT` | new terms still satisfy guards | `committing` |

Stages, in order, each with a pass condition computed by `engine.ts` before animation starts (the animation only reveals a precomputed list, so the result never depends on timing):

1. Validate requirement fields
2. Confirm supplier-approved compatibility
3. Load the private production window and remaining capacity
4. Compute delivered cost (product, freight and handling, fee)
5. Check supplier floor and buyer maximum delivered price
6. Check capacity against quantity and fill rule
7. Check production cutoff
8. Record commitment and update matched volume

Reduced motion: `useReducedMotion()` (media query) or the "Show results immediately" checkbox makes `searching` and `committing` resolve in one dispatch with all stages Done. Loading state is the `searching` state. Empty state is `no_match`. Validation error state is `requirement` with `errors`.

## 8 Simulation engine

Money is `Money4`, an integer count of ten-thousandths of a dollar. $0.3375 is 3375. Display rounds to four decimals for unit prices and to cents for totals.

Algorithm (`matching.evaluate`):

1. `assess`: compare requirement attributes to the window's compatibility requirements: board grade, flute, style, dimensions, print, finishing, certification. All match: `full`. Board and corrugation match but print or finishing differ: `partial`. Board grade or wall differs: `false`.
2. `remaining = approvedIncremental - committed` (60,000 minus 35,000 = 25,000).
3. Product component: look up the supplier's private tier for the buyer quantity. Tiers are fixture data; the floor is never shown to the buyer.
4. `freightHandling`: fixture per-unit rate for the service lane (New Jersey to ZIP 11373).
5. `fee`: fixture disclosed platform fee per unit.
6. `delivered = product + freightHandling + fee`.
7. Guards: `product >= floor`; `delivered <= maxDelivered`; `quantity <= remaining` when fill is 100 percent, otherwise `min(quantity, remaining) >= minFillUnits`; `clock.today <= cutoff`.
8. Totals: `orderTotal = quantity * delivered`, `baselineTotal = quantity * currentDelivered`, `savings = baselineTotal - orderTotal`, `savingsPct = savings / baselineTotal`.
9. On execution: `committed += quantity`, `remaining -= quantity`, fulfillment state `Scheduled for production`.

Fixture table (illustrative):

| Item | Value |
| --- | --- |
| Product | 12 x 12 x 12 RSC corrugated box, 32 ECT kraft |
| Facility | Fictional New Jersey facility, label "Facility NJ-1" |
| Anchor customer | Hidden, shown as "Existing customer (private)" |
| Approved incremental capacity | 60,000 units |
| Already committed | 35,000 units |
| Minimum additional quantity | 5,000 units |
| Demo today | Tuesday, October 13, 2026 (illustrative) |
| Production cutoff | Friday, October 16, 2026 (three days) |
| Production window | October 19 to 21, 2026 |
| Delivery window | October 26 to 28, 2026 |
| Private price tiers (product only) | 5,000+: $0.3450; 20,000+: $0.3375; 40,000+: $0.3300 |
| Private price floor | $0.3300 |
| Freight and handling, NJ-1 to ZIP 11373 | $0.0290 per unit |
| Disclosed SupplyWeave fee | $0.0075 per unit |
| Buyer quantity | 20,000 |
| Buyer destination | ZIP 11373 |
| Buyer current delivered price | $0.4300 |
| Buyer maximum delivered price | $0.4000 |
| Minimum fill | 100 percent |
| Equivalents | Allowed |

Worked arithmetic, verified with node:

```
node -e "const q=20000,p=3375,f=290,fee=75,base=4300;const d=p+f+fee;const tot=q*d/1e4,b=q*base/1e4;console.log({delivered:d/1e4,total:tot,baseline:b,savings:b-tot,pct:+((b-tot)/b*100).toFixed(1),committedAfter:35000+q,remaining:60000-35000-q})"
{ delivered: 0.374, total: 7480, baseline: 8600, savings: 1120, pct: 13, committedAfter: 55000, remaining: 5000 }
```

Pricing lesson made visible: the buyer's maximum ($0.40) is not the price charged ($0.374). The supplier's floor ($0.33) is never displayed to the buyer. The disclosure shows "Your maximum was $0.4000. The price is set by the supplier's private tier plus delivered costs, not by your limit."

## 9 Scenario catalogue

| # | Scenario | Input delta | Engine output | UI |
| --- | --- | --- | --- | --- |
| 1 | Successful fully compatible match (default) | none | full; delivered 0.3740; executes | Full flow to ResultPanel: $0.3740, $7,480, $1,120 (13.0 percent), delivery Oct 26 to 28, "Scheduled for production" |
| 2 | Partial compatibility | requirement adds "1-color flexo print" | partial: board and corrugation shared, printing separate | `awaiting_supplier`; commit disabled; note "Supplier confirmation required before pricing is final" |
| 3 | Incompatible request | requirement changes to 44 ECT double wall | false | `no_match` empty state: "Looks similar, needs different board and machine settings" |
| 4 | Price exceeds limit | max delivered $0.3600 | delivered 0.3740 > 0.3600 | stage 5 Blocked; `not_executed(price_limit)`: "Your maximum delivered price was not met. Nothing was ordered." |
| 5 | Full fill, insufficient capacity | quantity 30,000 | 30,000 > 25,000 remaining with 100 percent fill | stage 6 Blocked; `not_executed(full_fill)`; note that partial fill of 25,000 was possible but not allowed by the rule |
| 6 | Cutoff expired | demo today set to Oct 17 | cutoff Oct 16 passed | `not_executed(cutoff_expired)` directly from search: "This window closed. Your requirement stays saved for the next compatible run." |
| 7 | Supplier modifies or declines | supplier view action | modify: capacity reduced to 15,000 so full fill fails; decline: closed | `modified` with changed-field list, or `not_executed(supplier_declined)` |
| 8 | Loading, empty, validation error, success, reset | quantity blank or below 5,000 | validation errors | inline errors, announced; `searching` shows loading; Reset returns to scenario 1 defaults |

All scenario copy states "Illustrative demo data" in the panel header.

## 10 Data model

```ts
type Money4 = number                       // integer ten-thousandths of a dollar
type Units = number
type DemoDate = string                     // ISO date, fixture clock only

interface ProductSpec { id; name; boardGrade; flute; style; dimensionsIn; print; finishing; certifications[] }

interface BuyerRequirement {
  id; product: ProductSpec; quantity: Units; destinationZip; currentDelivered: Money4
  maxDelivered: Money4; minFillPct: 100 | number; allowEquivalents: boolean
  deliveryWindow: { start: DemoDate; end: DemoDate; illustrative: true }
}

interface ProductionWindow {
  id; facilityLabel; productFamily; compatibility: CompatibilityRequirements
  approvedIncremental: Units; committed: Units; minAdditional: Units
  cutoff: DemoDate; productionWindow: { start; end }
  private: { tiers: { minQty: Units; product: Money4 }[]; floor: Money4; anchorCustomer: 'hidden' }
  serviceRegions: string[]; deliveryTerms: string; qualityRequirements: string[]
}

type CompatibilityState = 'full' | 'partial' | 'false'
interface CompatibilityAssessment { state; sharedSteps: string[]; separateSteps: string[]; reasons: string[]; source: 'supplier_approved_demo_data' }

interface DeliveredCostBreakdown { product: Money4; freightHandling: Money4; fee: Money4; delivered: Money4 }

interface MatchedOpportunity {
  window: ProductionWindow; assessment; breakdown; remainingBefore: Units
  guards: { floor: boolean; maxPrice: boolean; capacity: boolean; cutoff: boolean }
  terms: CommitmentTerm[]
}

interface Commitment { requirementId; windowId; quantity; delivered: Money4; total: Money4; baselineTotal; savings; savingsPct }
type FulfillmentState = 'scheduled' | 'in_production' | 'shipped' | 'delivered'   // demo shows 'scheduled'

type StageStatus = 'waiting' | 'running' | 'done' | 'blocked'
interface ProcessingStage { id; label; status; note? }

interface DemoAssumption { id; text }
interface RecommendedDirection { id; text }
interface PilotHypothesis { id; text; figure?: string }
interface OpenQuestion { id; text }
interface MvpBoundary { id; text }
interface FutureIdea { id; text; phase?: 3 }
```

The five scope kinds are separate interfaces and separate exported arrays. `ScopeStatus` renders each array under its own labeled heading; there is no shared array they could be mixed in.

## 11 Privacy rules

| Viewer | Sees | Never sees |
| --- | --- | --- |
| Buyer | Facility label, product family, remaining capacity in units, cutoff, its own delivered breakdown, "Why this matches" | Supplier price tiers, floor, anchor customer identity, quantity, or schedule, other buyers |
| Supplier | Its own window, compatible demand as "Buyer A/B/C", units, destination ZIP prefix, consolidated order, revenue | Buyer's maximum delivered price, buyer's current supplier or baseline price, buyer identity |
| Visitor | Everything above, clearly split by lane and labeled illustrative | |

Enforcement: the buyer slice receives a `BuyerVisibleWindow` projection that omits the `private` field at the type level; the supplier slice receives requirements with `maxDelivered` and `currentDelivered` stripped. Tests assert the projections have no private keys.

## 12 Supplier production window view

Compact form, one column, nine fields matching the brief (product and family, compatibility requirements, approved incremental capacity 60,000, minimum additional quantity 5,000, cutoff, confidential tiers and floor marked "Private to you", service region, delivery terms, quality and certification requirements). Prefilled; editable.

After "Save production window": results list, not a dashboard.

| Result | Illustrative value |
| --- | --- |
| Compatible standing demand found | 3 requirements, 42,000 units total |
| Fits remaining capacity and fill rules | 1 requirement (Buyer A, 20,000 units); Buyer B 12,000 and Buyer C 10,000 exceed remaining capacity after Buyer A under full-fill rules |
| Consolidated supplemental order | 20,000 units, product value $6,750 (20,000 x $0.3375) |
| Estimated incremental revenue | $6,750 product value, labeled illustrative |
| Manifest summary | 1 destination, ZIP 11373 (Queens, NY), delivery Oct 26 to 28 |
| Controls | Approve (confirms opportunity), Decline (buyer scenario 7 decline), Modify (capacity to 15,000, buyer scenario 7 modify) |

## 13 Roadmap and business model content

Roadmap: Phase 1 "Supplier production coordination software" and Phase 2 "External demand network" are both marked "Shown in this prototype". Phase 3 "Cross manufacturer routing" is marked "Future, not in this prototype" with one sentence.

Business model, each row labeled "Working hypothesis, not final pricing":

1. Success fee of 4 to 6 percent on genuinely new network-sourced product value, excluding freight and tax.
2. Future supplier software subscription for coordinating production across existing customers ($500 to $2,000 per facility per month, hypothesis).
3. Optional future payment, protection, financing, freight, and integration revenue.

A line states buyers pay no membership fee in the simulated launch model. See decision 22.2 on the demo fee amount.

## 14 Content model and vocabulary

Preferred terms: standing requirement, production window, approved incremental capacity, compatible, supplier approved, delivered price, current delivered price, maximum acceptable delivered price, production cutoff, matched volume, consolidated supplemental order, delivery window, production status.

Banned: guaranteed lowest price, always cheaper, more demand lowers price, AI powered, risk free, marketplace for everything, reverse auction, bid.

Illustrative labeling: every panel that shows a number carries "Illustrative demo data" in its header; the ResultPanel repeats it. "Demo assumptions" is a permanent disclosure at the bottom of the demo and is repeated in section 9 of the page.

The buyer copy says explicitly: "SupplyWeave is an additional savings channel. You keep your current supplier as a fallback."

## 15 Design system

Reused from the earlier design work with the state table revised for the new model.

Colors (light only): paper #FFFFFF, surface #F4F4F1, ink #1B1B1F (17.2:1), ink-2 #45464D (9.4:1), ink-3 #5F6068 (6.3:1), line #D9D9DD, line-strong #8A8B93 (3.4:1 for controls), accent #1F4FD1 (6.8:1 both ways), accent-strong #17409F, accent-soft #E9EEFB, positive #1E6F3D (6.2:1), positive-soft #E7F3EA, caution #7A4F00 (7.1:1), caution-soft #FBF1DC, negative #B3261E (6.5:1), negative-soft #FCEBEA. All text pairs meet WCAG AA.

Type: system stack, 17 px base desktop, 16 px mobile, nothing under 15 px. Scale: 15, 16, 17, 20, 24, 32, 44 px; key figures 36 px with tabular numerals. Prose max 68 ch.

Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96 px. Container 1120 px. Section padding 96 px desktop, 48 px mobile.

Radius and shadow: 4 px inputs and buttons, 8 px on the few panels. No shadows except the sticky mobile summary bar. At most three bordered panels visible at once. No gradients, pills, or badges.

Motion: 150 ms transitions, 600 ms count-up for matched volume, 700 ms per stage. Allowed animation: the count-up, stage status change, result fade-in. Under reduced motion everything is instant.

State encoding, always word plus shape plus color:

| State | Word | Shape |
| --- | --- | --- |
| Buyer lane | "You" | Filled square |
| SupplyWeave lane | "SupplyWeave" | Outlined square |
| Compatibility full / partial / false | "Full", "Partial", "Not compatible" | Filled circle, half circle, circle with cross |
| Matched volume committed | "Committed" | Filled bar segment plus number |
| Remaining capacity | "Remaining" | Outlined bar segment plus number |
| Stage waiting / running / done / blocked | words | empty circle, half circle, check circle, cross circle |
| Executed / Not executed | words | check circle, cross circle |
| Scope kinds | "Recommended direction", "Pilot hypothesis", "Open question", "MVP boundary", "Demo assumption" | filled square, outlined square, question glyph, bracket glyph, dotted square |

## 16 Responsive strategy

Breakpoints: 640 px (tables stack to definition lists), 1024 px (two columns allowed).

| Section | Desktop | Under 1024 px |
| --- | --- | --- |
| Problem | Two columns | Two numbered steps |
| Buyer demo | Left lane "You" (form, commit), right lane "SupplyWeave" (opportunity, stages, result) | Single column in step order; a sticky bottom summary bar shows quantity, delivered price, savings, and the Commit button so the summary stays near the action |
| Supplier view | Form left, results right | Form then results |
| Buyer vs SupplyWeave | Two parallel lanes | Alternating steps, each labeled with its lane |
| Compatibility | Three columns | Three stacked blocks |
| Tables | Real tables | Definition-list rows |

No horizontal scrolling for core content. Touch targets 44 px minimum. Every demo action is a button or form control, so keyboard and touch are equivalent.

## 17 Accessibility plan

1. Semantic landmarks: header, main, ten sections with h2, footer. One h1.
2. Focus: visible 2 px accent ring on every interactive element; focus moves to the ResultPanel heading on completion and to the first error on validation failure.
3. Live region: one polite region announces "Searching", "Opportunity found", each stage completion, "Order executed at $0.3740 per unit", and blocked reasons.
4. Forms: every field has a label and help text; errors are linked via `aria-describedby`.
5. Reduced motion: media query plus a visible checkbox.
6. No hover-only information: disclosures are buttons, the capacity bar has its numbers in text.
7. Contrast: all pairs listed in section 15 meet AA; lint with jsx-a11y.
8. Keyboard path: scenario radios, requirement fields, Save, Commit, disclosures, Reset, supplier form, supplier controls, all in DOM order.

## 18 Testing and quality plan

Engine unit tests (`domain/__tests__`):

1. `money.test`: add, multiply, percent, format, no float drift.
2. `pricing.test`: breakdown for 20,000 units equals 3375 + 290 + 75 = 3740.
3. `engine.success.test`: delivered 0.3740, total 7,480, baseline 8,600, savings 1,120, 13.0 percent, committed 55,000, remaining 5,000, state `scheduled`.
4. `compatibility.test`: full, partial (print differs), false (44 ECT).
5. `guards.test`: max 0.3600 blocks at stage 5; 30,000 units with full fill blocks at stage 6; cutoff past blocks; floor guard holds; buyer max never becomes the price.
6. `privacy.test`: buyer projection has no `private` key; supplier projection has no `maxDelivered` or `currentDelivered`.

Reducer tests (`state/__tests__`): every transition in section 7, reset from every state, immediate path completes in one dispatch, supplier decline and modify affect the buyer state.

Component tests: full commit flow with user-event reaching the $7,480 result; validation error announced; scenario selector switches inputs; reduced-motion path renders result immediately; supplier Modify shows "Terms changed".

Static checks: `npm run lint`, `npm run typecheck`, `npm run build`.

Manual UX checklist (acceptance list from the brief, section 20, plus): hero understood in five seconds; primary demo is a production window, not a weekly market; baseline, matched price, and savings visible; supplier can create a window; full, partial, false explained; anchor customer hidden; no bidding; numbers correct; illustrative labels everywhere; hypotheses labeled; boundaries and open questions visible; works offline; desktop, tablet, mobile usable; focus, contrast, reduced motion, live region handled.

## 19 Deployment

`deploy.yml` copied from the sibling projects: on push to main, Node 20, `npm ci`, lint, test, build, upload `dist`, deploy to GitHub Pages. Vite `base: './'`. User actions before first deploy: create the GitHub repository `supplyweave` under joshuakeum9-cell, enable Pages with source "GitHub Actions". Expected URL: https://joshuakeum9-cell.github.io/supplyweave/. Pushing happens only with explicit permission.

## 20 Implementation plan

| Phase | Deliverable | Gate |
| --- | --- | --- |
| 0 Scaffold | package.json, Vite, TS, ESLint, Vitest, tokens.css, base.css, deploy.yml, README stub | `npm run lint`, `typecheck`, `build` pass on an empty App |
| 1 Domain | types, money, compatibility, pricing, matching, engine, all fixtures | Engine tests green, including 0.3740 / 7,480 / 1,120 |
| 2 State | reducer, events, provider, immediate path | Reducer tests green |
| 3 Shell and explainers | App, Section, Hero, Problem, UserSystemFlow, CompatibilityExplainer, Roadmap, BusinessModel, ScopeStatus, Closing | Typecheck, lint, visual check in browser |
| 4 Buyer demo | all BuyerMatchDemo components, LiveRegion, StatusLabel, Disclosure, DataTable | Component flow test green |
| 5 Supplier view | WindowForm, WindowResults, OpportunityControls wired to buyer scenario 7 | Tests for decline and modify green |
| 6 Responsive and accessibility | breakpoints, sticky summary, focus management, reduced motion, jsx-a11y clean | Manual checklist at 1280, 1024, 768, 375 px |
| 7 Finish | README, final lint, test, build; summary of files and limitations | All checks pass; user decides on push and deploy |

Estimated size: about 70 source files, 25 test files.

## 21 Requirements traceability

| Follow-up brief section | Satisfied by |
| --- | --- |
| 1 Working approach | Sections 3, 18, 20; no paid services; static Pages deploy |
| 2 Rename | Name is SupplyWeave in `index.html`, copy.ts, fixtures, labels, README; no "AI" positioning (section 14 banned list) |
| 3 Revised definition | Hero and Problem content (section 5) |
| 4 Positioning | Hero h1, buyer and supplier value lines in section 5 rows 1, 3, 4; banned positions in section 14 |
| 5 Three phases | Roadmap (section 13); demo covers Phases 1 and 2 |
| 6 Remove outdated concepts | No weekly market, forecast interest, clearing, spot comparison, or demand counter anywhere; max price, private pricing, delivered cost, qualification, reliability, tracking retained (sections 8, 10) |
| 7 Primary demo scenario | Fixture table and arithmetic (section 8) |
| 8 Buyer interaction, 10 steps | State machine and components (sections 6, 7): RequirementForm, MatchingFields, OpportunityPanel, WhyThisMatches, CostComparison, CommitmentTerms, Commit, MatchedVolume, ResultPanel, Reset; fallback supplier copy (section 14) |
| 9 Supplier interaction | Section 12 form fields and results; privacy (section 11) |
| 10 Compatibility | Section 9 scenarios 1 to 3, CompatibilityExplainer, assessment source label |
| 11 Pricing logic | Engine steps 3 to 7, PriceBreakdown disclosure, section 8 pricing lesson |
| 12 Business model | Section 13, hypothesis labels, no buyer membership fee |
| 13 Information architecture | Section 5, ten sections in the required order |
| 14 Product states | Section 9, all eight |
| 15 MVP boundaries | `mvpBoundaries` array, ScopeStatus, DemoAssumptionsNote (sections 10, 14) |
| 16 Design | Section 15 |
| 17 Responsive and accessible | Sections 16, 17 |
| 18 Technical | Sections 3, 4, 8, 10; separate typed models; deterministic; no backend; optional localStorage preference only |
| 19 Direction, hypotheses, questions | Five separate arrays and headings (section 10, ScopeStatus) |
| 20 Acceptance checklist | Section 18 manual checklist and automated tests |

## 22 Decisions the user must confirm, and risks

Decisions:

1. Repository name `supplyweave` and URL https://joshuakeum9-cell.github.io/supplyweave/. Local folder is already `C:\Local\Projects\Claude Code\supplyweave`.
2. Demo fee inconsistency: the brief fixes the disclosed fee at $0.0075 per unit, which is 2.2 percent of the $0.3375 product component, while the business model states a 4 to 6 percent success fee. Recommended: keep the brief's numbers so the result stays $0.3740 and $7,480, and label the demo fee "illustrative, below the hypothesis range". Alternative: change the fee and accept different result numbers.
3. Font: system stack (recommended, zero requests) or self-hosted Inter.
4. Styling: plain CSS Modules (recommended, per the original brief) or Tailwind as in sibling projects.
5. Spot purchasing and broad market clearing: recommended to omit entirely rather than demote, since they no longer aid comprehension; one sentence in future ideas is optional.
6. localStorage: recommended none, except the "show results immediately" preference.
7. Push and deploy: separate permission after the build passes.

Risks:

| Risk | Mitigation |
| --- | --- |
| Demo reads as a marketplace again | Copy review against the banned list in section 14 before phase 7 |
| Supplier view grows into a dashboard | Results are a list of six rows and three buttons, nothing more |
| Arithmetic drift | Integer Money4 plus tests asserting exact values |
| Partial-compatibility state confuses visitors | One-line status plus link to the compatibility section |
| Fee inconsistency noticed by visitors | Decision 22.2 label |
