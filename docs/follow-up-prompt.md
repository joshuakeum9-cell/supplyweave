# SupplyWeave Claude Code Follow Up Prompt

You previously implemented a website prototype from an earlier Claude Code prompt for this product. The product strategy has now changed materially. Update the existing repository to reflect the revised model below.

Do not create a second disconnected prototype inside the repository. Inspect the current implementation, preserve useful components and styling, and revise the existing experience coherently.

## 1. Working approach

Act as a senior product designer, UX designer, frontend engineer, interaction designer, and technical storyteller.

Before changing code:

1. Inspect the repository structure, framework, scripts, components, styles, fixture data, tests, and deployment configuration.
2. Identify which parts of the current prototype can be reused and which now conflict with the revised product strategy.
3. Briefly state the implementation plan.
4. Implement the changes rather than stopping at recommendations or wireframes.
5. Do not rewrite unrelated code.
6. Do not add paid services, API dependencies, real payments, external databases, or live marketplace functionality.
7. Keep the prototype deployable as a static GitHub Pages compatible site unless the repository already uses another working static deployment method.
8. Run the existing lint, type check, test, and production build commands. Fix errors before finishing.

DO NOT OPTIMIZE FOR MAKING THE WEBSITE LOOK IMPRESSIVE. OPTIMIZE FOR MAKING THE PRODUCT EASY TO UNDERSTAND.

## 2. Rename the product everywhere

Replace the old name `AI Supply` with `SupplyWeave` throughout:

1. Visible interface text
2. Page title and metadata
3. README and documentation
4. Fixture data labels
5. Component copy
6. Accessible labels
7. Any project specific constants

Do not describe SupplyWeave as an AI product. AI may eventually assist with specification parsing or matching, but it is not the core product or value proposition.

## 3. Revised product definition

SupplyWeave is no longer primarily a broad pooled procurement marketplace with weekly markets.

SupplyWeave is:

> A private production run utilization network that helps manufacturers fill compatible capacity and gives growing businesses access to production scale pricing without requiring either side to replace its existing relationships.

The economic problem is:

1. A manufacturer has a scheduled production setup, material configuration, or approved incremental capacity that can accept additional compatible volume before a cutoff.
2. A smaller buyer has a recurring requirement that is too small to independently receive the strongest production economics.
3. The two sides currently lack a simple way to discover compatibility, verify the economics, and commit before the opportunity expires.

The website should make this temporary coordination problem easy to understand.

## 4. Revised positioning

Use clear language such as:

### Primary definition

`Fill compatible production capacity with committed demand.`

### Buyer value proposition

`Get production scale pricing without meeting the entire production minimum yourself.`

### Supplier value proposition

`Fill the rest of a compatible production run with committed, qualified orders.`

Do not position SupplyWeave as:

1. A generic GPO
2. A supplier directory
3. A public factory schedule
4. A public reverse auction
5. A broad marketplace for every business supply
6. An AI product
7. A promise of the guaranteed lowest price

## 5. Core strategic change

The product should be shown in three phases:

### Phase 1  Supplier production coordination software

Manufacturers create private production windows and coordinate compatible demand from their existing customers.

### Phase 2  External demand network

When a production window still has approved incremental capacity, SupplyWeave privately searches standing demand from new buyers.

### Phase 3  Cross manufacturer routing

After repeated transactions are proven, SupplyWeave can compare qualified opportunities across manufacturers using compatibility, delivered cost, timing, capacity, and reliability.

The main interactive demonstration should focus on Phases 1 and 2. Phase 3 should appear only as a restrained future state.

## 6. Remove or demote outdated concepts

The existing website may contain a large weekly pooled market, forecast interest, market clearing, spot versus future market comparison, or a large anonymous demand counter.

Change the hierarchy as follows:

1. Remove the generic weekly pooled market from the hero and primary demo.
2. Remove any suggestion that all demand joins one broad market.
3. Remove language implying that more demand automatically lowers price.
4. Remove public supplier bidding or public ranking.
5. Demote spot purchasing and broad market clearing to an optional future concept or remove them if they no longer help comprehension.
6. Preserve buyer maximum delivered price, private supplier pricing, delivered cost calculation, qualification, reliability, and fulfillment tracking because those mechanics remain relevant.

## 7. Primary interactive demonstration

Build a deterministic local simulation around one upcoming compatible production run.

Use this illustrative scenario:

### Product

12 x 12 x 12 RSC corrugated box, 32 ECT kraft

### Supplier opportunity

1. Fictional New Jersey manufacturing facility
2. Main customer identity hidden
3. 60,000 additional units approved for the compatible production window
4. 35,000 compatible units already committed
5. Production cutoff in three days
6. Supplier details and exact price floor remain private

### Buyer standing requirement

1. Quantity: 20,000 units
2. Destination: ZIP 11373
3. Current delivered price: $0.430 per unit
4. Maximum acceptable delivered price: $0.400 per unit
5. Minimum fill: 100 percent
6. Qualified equivalents: allowed
7. Delivery window: use a clearly labeled illustrative date window

### Matched result

1. Product component: $0.3375 per unit
2. Freight and handling: $0.0290 per unit
3. Disclosed SupplyWeave fee: $0.0075 per unit
4. Final delivered price: $0.3740 per unit
5. Final order total: $7,480
6. Buyer baseline total: $8,600
7. Buyer savings: $1,120 or approximately 13.0 percent
8. Compatible committed volume after this buyer: 55,000 units
9. Remaining approved incremental capacity: 5,000 units

All data must be clearly labeled as illustrative.

## 8. Required buyer interaction

The buyer experience should show:

1. Save or review a standing requirement.
2. See exactly which fields are used for matching.
3. Receive a private compatible production opportunity.
4. Review why the order is compatible.
5. Compare current delivered cost with SupplyWeave delivered cost.
6. Review timing, quantity, cancellation, and quality assumptions.
7. Commit the simulated order.
8. Watch committed matched volume move from 35,000 to 55,000 units.
9. Receive the final simulated result, savings, delivery window, and production status.
10. Reset the simulation.

The buyer is not switching suppliers permanently. The interface should explain that SupplyWeave is an additional savings channel and that the buyer can retain its normal supplier as a fallback.

## 9. Required supplier interaction

Add a compact but functional supplier view. The supplier should be able to simulate creating a production window with:

1. Product and production family
2. Compatibility requirements
3. Approved incremental capacity
4. Minimum additional quantity
5. Production cutoff
6. Confidential price tiers or price floor
7. Service region
8. Delivery terms
9. Quality and certification requirements

After saving the window, show:

1. Compatible standing demand found
2. Number of matched buyers without exposing unnecessary identities
3. Total compatible units
4. Estimated incremental revenue
5. One consolidated supplemental order
6. Delivery destinations or manifest summary
7. Controls to approve, decline, or modify the opportunity

Do not expose the anchor customer's identity, negotiated price, order quantity, or confidential schedule.

## 10. Compatibility explanation

The prototype must teach visitors that visual similarity is not enough.

Represent three compatibility states:

### Full compatibility

Same relevant material, dimensions, setup, tooling, print method, finishing, and quality requirements.

### Partial compatibility

Some upstream production steps can be shared, but printing, cutting, finishing, sorting, or handling remains separate.

### False compatibility

The products appear similar but require different tooling, materials, certifications, color controls, or machine settings.

For the successful demo, show a concise `Why this matches` explanation. Do not claim that an AI system has independently certified technical compatibility. Treat compatibility as supplier approved demo data.

## 11. Pricing logic

Do not create a public pricing war.

The pricing model should show:

1. The supplier privately sets acceptable incremental pricing, capacity, and a price floor.
2. The buyer privately sets a maximum acceptable delivered price.
3. SupplyWeave adds product cost, freight, handling, and a disclosed platform fee.
4. The transaction executes only when the supplier economics and buyer constraints are both satisfied.
5. The buyer's willingness to pay does not automatically become the price charged.
6. The system compares final delivered cost, not factory price alone.

Include an expandable price breakdown for the successful demo.

## 12. Business model explanation

Add a restrained section explaining how SupplyWeave could make money. It should not look like a consumer pricing page.

Show:

1. A 4 percent to 6 percent success fee on genuinely new network sourced product value, excluding freight and tax
2. A future supplier software subscription for production coordination across the supplier's existing customers
3. Optional future payment, protection, financing, freight, and integration revenue

Label every amount or range as a working hypothesis rather than final commercial pricing.

Do not charge buyers a membership fee in the simulated launch model.

## 13. Information architecture

Restructure the one page experience in this order unless the current repository strongly supports another clear structure:

1. Immediate revised product definition
2. The stranded capacity and fragmented demand problem
3. Interactive buyer production match demo
4. Supplier production window view
5. What the buyer does versus what SupplyWeave does
6. Compatibility explanation
7. Supplier software first and network second roadmap
8. Business model
9. MVP boundaries, assumptions, and open questions
10. Concise closing summary

Do not lead with generic slogans, testimonials, fake logos, a blog, or decorative statistics.

## 14. Required product states

The prototype should support or clearly demonstrate:

1. Successful fully compatible match
2. Partial compatibility requiring supplier confirmation
3. Incompatible request that does not match
4. Match rejected because delivered price exceeds the buyer limit
5. Match rejected because the buyer requires full fill and capacity is insufficient
6. Production cutoff expired
7. Supplier modifies or declines the opportunity
8. Loading, empty, validation error, success, and reset states

At minimum, implement the successful scenario completely. Alternate states may use a compact scenario selector if that produces a clearer prototype.

## 15. MVP boundaries

The website is an explanatory prototype using local data.

It must not claim to:

1. Process live payments
2. Create enforceable purchase contracts
3. Verify real factory capacity
4. Arrange live freight
5. Underwrite buyer credit
6. Perform production grade optimization
7. Independently certify technical compatibility
8. Guarantee savings, quality, or delivery

Keep a visible `Demo assumptions` area.

## 16. Design requirements

Keep the experience modern, calm, professional, and highly understandable.

1. Use strong typography and restrained color.
2. Use generous whitespace and clear hierarchy.
3. Avoid excessive cards, pills, gradients, shadows, and rounded containers.
4. Avoid generic AI imagery and chatbot motifs.
5. Use animation only to explain a state change, such as matched volume increasing.
6. Respect reduced motion preferences.
7. Make buyer and supplier states visually distinct without relying on color alone.
8. Keep the central cost comparison and commitment conditions easy to scan.

## 17. Responsive and accessible behavior

1. Use semantic HTML and a logical heading order.
2. Meet WCAG AA contrast.
3. Provide visible keyboard focus states.
4. Make all form fields properly labeled.
5. Announce meaningful simulation state changes with an appropriate live region.
6. Preserve complete usability on desktop, tablet, and mobile.
7. Convert multi-column flows into a logical step sequence on small screens.
8. Do not require hover to understand any important information.

## 18. Technical implementation

1. Use typed local fixture data.
2. Keep buyer requirements, supplier run windows, matches, compatibility states, and transaction results as separate typed models.
3. Use a small deterministic state machine or similarly explicit state model.
4. Keep calculations deterministic so the documented scenario always produces $0.374 per unit, $7,480 total, and $1,120 savings.
5. Separate simulation logic from presentation components.
6. Persist only harmless demo preferences or progress in localStorage if useful.
7. Do not add a backend unless the existing repository already has one and it is required for the current prototype.
8. Do not collect sensitive or real business information.
9. Preserve current deployment behavior.

Suggested domain models include:

1. `BuyerRequirement`
2. `ProductionWindow`
3. `CompatibilityAssessment`
4. `MatchedOpportunity`
5. `DeliveredCostBreakdown`
6. `Commitment`
7. `FulfillmentState`
8. `DemoAssumption`

Adapt component names to the existing architecture. Do not force these exact names if the repository already has a coherent convention.

## 19. Confirmed direction, hypotheses, and open questions

Keep these categories visually separate.

### Recommended direction

1. Supplier software first
2. Private matching
3. Standing buyer requirements
4. Supplier approved compatibility
5. Delivered cost comparison
6. No required full supplier switch
7. One category at launch

### Pilot hypotheses

1. Buyers may require approximately 10 percent delivered savings to justify uncertainty
2. A 4 percent to 6 percent success fee may be viable on new incremental business
3. Supplier software may eventually support a $500 to $2,000 monthly facility subscription
4. Higher value repeat orders are more attractive than very small transactions

### Open questions

1. First product category
2. Initial geography
3. Exact supplier contract and fee
4. Freight responsibility
5. Quality remedies and inspection process
6. Cancellation and deposit rules
7. Minimum transaction size
8. Exact subscription pricing

Do not present hypotheses or open questions as settled facts.

## 20. Acceptance checklist

Before reporting completion, confirm all of the following:

1. `AI Supply` has been replaced by `SupplyWeave` everywhere relevant.
2. The hero explains production run utilization within five seconds.
3. The primary demo is an upcoming compatible production window, not a broad weekly market.
4. The buyer can see the baseline price, matched delivered price, and savings.
5. The supplier can create or review a private production window.
6. The site explains full, partial, and false compatibility.
7. Confidential anchor customer information is not shown.
8. The pricing interaction does not create a public bidding war.
9. The successful scenario produces $0.374 per unit, $7,480 total, and $1,120 savings.
10. All data is labeled illustrative.
11. The business model is labeled as a working hypothesis.
12. MVP boundaries and open questions remain visible.
13. The demo works without API keys or paid services.
14. Desktop, tablet, and mobile layouts are usable.
15. Keyboard focus, contrast, reduced motion, and live state announcements are handled.
16. Existing lint, test, type check, and production build commands pass.

Implement the complete revision now. At the end, summarize the files changed, the product behavior implemented, the checks run, and any remaining limitations.
