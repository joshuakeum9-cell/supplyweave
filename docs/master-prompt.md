# Claude Code Master Prompt for AI Supply

## 1 Role

Act as a senior product designer, UX and UI designer, frontend engineer, interaction designer, and technical storyteller.

Your primary job is to make the product understandable. The website should be visually polished, but product comprehension is more important than decoration.

DO NOT OPTIMIZE FOR MAKING THE WEBSITE LOOK IMPRESSIVE. OPTIMIZE FOR MAKING THE PRODUCT EASY TO UNDERSTAND.

The ideal reaction from a first time visitor is: "Oh. I understand how this works."

## 2 First inspect the repository

Before changing code:

1. Inspect the repository structure, framework, scripts, dependencies, existing components, styles, assets, tests, and deployment configuration.
2. Identify the current design system and reuse it when it is coherent.
3. Do not rewrite unrelated code.
4. Avoid new dependencies unless they materially improve accessibility, maintainability, or the central product demonstration.
5. If the repository is blank or has no viable frontend, use React, TypeScript, and Vite with a clean CSS approach. Do not introduce paid services or external API costs.
6. State the implementation plan briefly, then implement it. Do not stop at a wireframe or a written proposal.
7. After implementation, run the available checks, tests, type checks, and production build. Fix problems before finishing.

## 3 Product context

The working product name is AI Supply.

AI Supply is a B2B procurement marketplace for repeat business supplies that can be standardized across qualified suppliers. It converts fragmented purchasing demand into executable weekly fulfillment markets.

Businesses often buy common supplies in quantities too small to reach the strongest supplier economics. Their demand is scattered across buyers, dates, locations, and inconsistent product descriptions. Suppliers face uncertain demand, surplus inventory, production overruns, and unused capacity.

AI Supply creates a controlled market for each combination of:

1. Product specification
2. Delivery geography
3. Fulfillment week

Buyers can use two purchasing modes:

1. Spot purchase for an urgent or immediate need
2. Weekly pooled market for planned demand in a future fulfillment week

Orders may be placed continuously. A future market can stay open for several weeks, but it clears once at its defined close.

The product distinguishes two demand types:

1. Committed demand, which is binding enough to count toward the executable market
2. Forecast or watchlist interest, which is informative but does not move the official committed total

The buyer does not merely request the lowest factory price. The system evaluates delivered cost, supplier capacity, product qualification, lead time, reliability, freight, and the buyer's constraints.

The product is not an open listing directory. AI Supply controls the tradable product specification. Qualified suppliers may offer the same product or an approved equivalent.

The marketplace should not promise that price always decreases as demand grows. Additional demand can require a more expensive supply block or different freight. The buyer therefore enters a maximum acceptable delivered unit price. The order executes only if the final delivered price remains within that limit.

Pooling is not automatically assumed to be cheapest. The interface should be able to show a spot option when it is better for the buyer.

## 4 Users

### Buyer

A business purchasing repeat standardized supplies. The buyer needs a reliable delivered price, a clear delivery window, and simple rules for what may execute.

### Supplier

A qualified manufacturer or distributor offering surplus inventory, incremental production capacity, or planned production capacity. The supplier needs usable aggregate demand visibility and a private way to submit capacity and pricing.

### Marketplace operator

The internal team defining product standards, approving suppliers, setting market rules, handling exceptions, and maintaining trust.

## 5 Buyer workflow

The buyer should be able to:

1. Search or select a controlled product specification.
2. Compare the spot option with open future weekly markets.
3. See committed volume, forecast interest, current delivered price estimate, close time, and the number of qualified suppliers.
4. Choose a fulfillment week.
5. Enter quantity and delivery ZIP or region.
6. Enter a maximum acceptable delivered unit price.
7. Choose a minimum fill rule, including full fill when required.
8. Allow or reject qualified equivalent suppliers.
9. Optionally allow timing flexibility or split delivery.
10. Review the order and commit it in the simulation.
11. Watch the committed market total update.
12. See what the system evaluates behind the scenes.
13. Receive an illustrative final delivered price, executed quantity, allocation, delivery window, and order status.

The website must clearly distinguish the buyer's action from the system's response at every stage.

## 6 Supplier workflow

The supplier side should show how a qualified supplier privately provides:

1. Product specification or approved equivalent
2. Available quantity by fulfillment week
3. Supply type, using surplus inventory, incremental run capacity, or planned production
4. Origin facility and service regions
5. Private quantity price curve
6. Maximum weekly capacity
7. Lead time and delivery terms
8. Certifications and qualification data
9. Fulfillment status after allocation

Supplier identities and offer details should not be exposed to competing suppliers. Buyers should not see confidential supplier costs.

## 7 What the system does

Make these system actions visible in the product demonstration:

1. Validate the product specification and order fields.
2. Route the order to the compatible product, geography, and fulfillment week market.
3. Keep forecast interest separate from committed demand.
4. Aggregate compatible committed orders.
5. Load qualified private supplier offers and capacity.
6. Calculate delivered cost rather than factory unit price alone.
7. Apply capacity, lead time, qualification, reliability, fill, substitution, and delivery constraints.
8. Determine a feasible supplier mix.
9. Set an illustrative final price and allocation.
10. Execute only orders whose maximum price and other rules are satisfied.
11. Return the result and begin a simulated fulfillment state.

The actual website is an explanatory simulation. It must not claim to process live payments, create enforceable contracts, arrange freight, or run a production grade optimization engine.

## 8 Product rules that are confirmed

Treat the following as the source of truth:

1. The marketplace focuses on standardized repeat business supplies.
2. The central modes are spot purchasing and future weekly fulfillment markets.
3. Orders may arrive continuously, while each future market has one close and clearing event.
4. Only committed demand counts toward the executable pool.
5. Forecast or watchlist demand is separate and clearly labeled.
6. The buyer states a maximum acceptable delivered price.
7. Price is based on delivered cost, not factory price alone.
8. The engine considers qualified supply, capacity, lead time, reliability, and buyer constraints.
9. The platform does not assume pooling is always cheaper.
10. Buyer identities and sensitive purchasing data are not shown to other participants.
11. The launch model does not require AI Supply to own inventory or warehouses.
12. The first product should use a narrow, controlled catalog rather than thousands of open supplier listings.

## 9 Assumptions to isolate

These are reasonable working assumptions, not confirmed product facts. Keep them labeled in explanatory content and easy to change in code:

1. Suppliers ship directly to buyers in the initial commercial model.
2. The initial product uses one narrow supply category.
3. Regional market definitions are simple rather than highly granular.
4. A modular application with a relational data model is sufficient for the first version.
5. Supplier reliability appears as an input to the clearing explanation, but the exact weighting is not final.

## 10 Open questions

Do not silently answer or present these as settled:

1. First customer segment
2. First launch category
3. Exact transaction fee or monetization model
4. Exact cancellation penalty schedule
5. Whether and when buyers see supplier identity
6. Whether AI Supply or suppliers procure freight
7. Exact price formation and allocation formula
8. Exact reliability and risk weighting
9. Exact geographic boundaries for a market
10. Payment authorization, deposits, credit approval, and settlement timing

The website may use simple labeled demo assumptions to make the simulation work, but it must place them in a visible "Demo assumptions" area and keep them out of claims about confirmed functionality.

## 11 Future ideas

Keep these out of the main MVP workflow. They may appear only in a restrained future section:

1. Buyer Net 30 or Net 60 terms through a financing partner
2. Faster supplier payout and embedded financing
3. Freight brokerage or managed freight
4. Cross docks or owned physical infrastructure after volume justifies it
5. ERP and procurement system integrations
6. Premium buyer and supplier analytics
7. Dynamic clearing cadence by product as liquidity grows
8. Advanced forecasting and capacity planning products

## 12 Website objective

The website's main purpose is to demonstrate and explain how AI Supply works. It is not merely a marketing landing page.

A visitor should be able to answer:

1. What happens when I use this?
2. What information do I provide?
3. What does the system do behind the scenes?
4. How do buyers, suppliers, and the marketplace interact?
5. What do I receive at the end?
6. Why does pooling and advance commitment matter?
7. What is real product scope versus a demo assumption or future idea?

## 13 Required information architecture

Use a concise one page experience unless the existing repository strongly supports a better structure.

Recommended order:

1. Immediate product definition
2. Interactive market demonstration
3. User action versus system action explanation
4. Market lifecycle and architecture
5. Supplier and operator views
6. Confirmed scope, assumptions, open questions, and future ideas
7. Short closing explanation of why the product matters

Do not lead with generic slogans, testimonials, pricing tiers, a blog, or decorative content.

## 14 Hero requirements

Within five seconds, the visitor should understand:

1. AI Supply pools committed business demand for standardized supplies.
2. Buyers can compare spot purchasing with future weekly markets.
3. The system matches the pool to qualified suppliers and returns a delivered price and fulfillment plan.

Use a short plain language headline and one clear supporting sentence. Include one primary action that scrolls to or opens the interactive demo. Avoid inflated claims.

## 15 Interactive product demo

This is the centerpiece of the website.

Create a deterministic front end simulation using local fixture data. It must remain usable with no API keys and no paid services.

Use this illustrative product:

12 × 12 × 12 RSC corrugated box, 32 ECT kraft

Use these illustrative buyer inputs:

1. Quantity: 20,000 units
2. Destination: ZIP 11373
3. Delivery: Week of October 19
4. Maximum delivered price: $0.40 per unit
5. Minimum fill: 100 percent
6. Qualified equivalents: allowed

Use this illustrative market state before the order:

1. Committed demand: 517,200 units
2. Forecast interest: show a clearly separate fictional value
3. Current estimated delivered price: $0.386 per unit
4. Multiple qualified suppliers: use fictional names or neutral labels only

After the buyer commits the simulated order:

1. Committed demand becomes 537,200 units.
2. The UI shows the validation and matching stages.
3. The UI explains that the estimate can move in either direction before close.
4. The simulated market clears at $0.374 per unit.
5. The buyer's 20,000 unit order executes because $0.374 is below the $0.40 limit.
6. The final illustrative total is $7,480.
7. The result includes an illustrative delivery window and fulfillment state.

Label all prices and quantities as illustrative demo data.

### Demo interaction sequence

1. The visitor selects the future weekly market.
2. The visitor edits or accepts the order fields.
3. A review step summarizes the commitment rules.
4. The visitor selects "Commit demo order."
5. The committed demand number visibly changes.
6. The system panel progresses through validation, aggregation, supplier matching, delivered cost calculation, constraint checks, and allocation.
7. The result panel appears with the final price and fulfillment information.
8. A reset control returns the demo to its original state.

Animation must explain state change or data movement. Respect reduced motion preferences and provide an immediate nonanimated state change when reduced motion is enabled.

## 16 Spot and weekly comparison

Show at least these options using illustrative data:

1. Spot: immediate availability and the highest known delivered price
2. Current or next weekly pool: nearer fulfillment and a current estimate
3. A later weekly pool: more time for demand accumulation and supplier planning

Do not imply a guaranteed monotonic price decline across later weeks. Use language such as "current estimate" and "subject to market close."

## 17 User versus system explanation

Create a clear paired flow. A visitor should be able to scan two lanes:

### What the buyer does

1. Compare
2. Configure
3. Commit
4. Track
5. Receive

### What AI Supply does

1. Load qualified market options
2. Validate order rules
3. Add binding demand to the correct pool
4. Recalculate feasible supply and delivered cost
5. Clear eligible orders and issue the result

Do not hide this explanation inside a modal or a long paragraph.

## 18 Visual system explanation

Create an interactive or progressively disclosed architecture view showing:

1. Buyer workspace
2. Supplier workspace
3. Operator console
4. Application and permissions layer
5. Controlled catalog
6. Market and commitment service
7. Supply offer service
8. Clearing and allocation engine
9. Fulfillment and settlement state
10. Relational data, audit events, background jobs, and external integrations

The first view should be understandable to a nontechnical visitor. A detail control may reveal technical responsibilities and sample data objects.

## 19 Supplier and operator views

Include compact switchable views or an explainer showing:

### Supplier view

1. Aggregate demand by product, region, and week
2. Private capacity and quantity price curve entry
3. Supply type
4. Qualification status
5. Allocation and fulfillment status

### Operator view

1. Product specification control
2. Supplier approval
3. Market schedule
4. Exceptions and disputes
5. Audit trail

These views should support comprehension. Do not build a dense enterprise dashboard.

## 20 Design language

The design should feel like a modern American software product:

1. Minimal
2. Spacious
3. Calm
4. Clear
5. Professional
6. Confident
7. Functional

Use strong typography, a restrained palette, generous whitespace, clear hierarchy, and purposeful interaction.

Avoid:

1. Excessive cards
2. Excessive badges
3. Excessive gradients
4. Heavy shadows
5. Too many rounded containers
6. Giant walls of text
7. Tiny type
8. Dense dashboard layouts
9. Decorative animations
10. Generic AI imagery, glowing brains, circuit graphics, or chatbot motifs
11. Fake testimonials, invented customer logos, or unsupported savings claims

Every visual element should improve understanding.

## 21 Responsive behavior

The full experience must work on desktop, laptop, tablet, and mobile.

Do not simply shrink the desktop layout.

For smaller screens:

1. Convert side by side flows into a clear step sequence.
2. Keep the order summary visible near the commit action.
3. Avoid horizontal scrolling for core content.
4. Preserve the distinction between buyer actions and system actions.
5. Keep touch targets accessible.
6. Ensure the demo remains fully usable with keyboard and touch.

## 22 Accessibility and interaction quality

1. Use semantic HTML and logical heading order.
2. Provide visible keyboard focus states.
3. Ensure color contrast meets WCAG AA.
4. Do not use color alone to communicate committed, forecast, estimated, or final states.
5. Provide labels and help text for every order input.
6. Announce important demo state changes with an appropriate live region.
7. Respect prefers reduced motion.
8. Make charts or diagrams understandable without relying on hover alone.

## 23 Technical implementation guidance

1. Keep product data in typed local fixtures or a clearly separated mock data module.
2. Use a small explicit state machine or equivalent predictable state model for the demo.
3. Keep calculations deterministic. The same inputs should produce the same documented result.
4. Separate presentation components from demo logic.
5. Make confirmed product rules, assumptions, and future ideas separate data structures so their labels cannot be confused.
6. Keep components modular and maintainable.
7. Avoid a backend unless the existing repository already requires one.
8. Do not use a real payment form or collect sensitive information.
9. Do not add analytics, trackers, or third party scripts unless already present and necessary.
10. Preserve existing repository conventions and deployment behavior.

## 24 Suggested component map

Adapt names to the repository, but the implementation should cover these responsibilities:

1. ProductDefinition
2. MarketComparison
3. OrderTicket
4. OrderReview
5. MarketVolumeDisplay
6. SystemProcessingSteps
7. ClearingResult
8. UserSystemFlow
9. ArchitectureExplorer
10. SupplierView
11. OperatorView
12. ScopeStatus
13. DemoAssumptions

## 25 Required states and edge cases

The demo should explicitly support or explain:

1. A valid order that executes below the buyer's price limit
2. An order that does not execute because the final price exceeds the limit
3. A full fill requirement that prevents partial execution
4. Qualified equivalents turned off
5. Forecast interest that does not change committed demand
6. A change in supply mix that can raise the current estimate
7. A spot option that may be better for an urgent purchase
8. Loading, empty, validation error, and reset states

At minimum, build the successful primary scenario fully and represent the other cases through a compact scenario selector or clearly explained alternate states.

## 26 Content requirements

Use concise, concrete language.

Preferred terms:

1. Committed demand
2. Forecast interest
3. Current delivered price estimate
4. Maximum acceptable delivered price
5. Qualified supplier
6. Fulfillment week
7. Market close
8. Final delivered price
9. Supplier allocation
10. Delivery window

Avoid unsupported phrases such as guaranteed lowest price, always gets cheaper, AI powered savings, or risk free.

## 27 UX test and iteration

Evaluate the finished website from the perspective of someone who knows nothing about AI Supply.

Ask:

1. Can I understand what this is within five seconds?
2. Can I understand the basic workflow within thirty seconds?
3. Can I see exactly what the buyer does?
4. Can I see exactly what the system does?
5. Can I identify the input and output?
6. Can I understand why the product exists?
7. Can I understand the architecture without reading a technical essay?
8. Can I distinguish confirmed functionality from assumptions and future ideas?
9. Does anything create unnecessary cognitive load?
10. Does the interactive example reach the documented $0.374 result and $7,480 total?

If any answer is no, iterate before finishing.

## 28 Completion checklist

Before reporting completion:

1. Confirm that the site explains the product rather than merely advertising it.
2. Confirm that the interactive demo works without external services.
3. Confirm that all demo data is labeled illustrative.
4. Confirm that committed and forecast demand are never conflated.
5. Confirm that the product does not promise price can only decrease.
6. Confirm that the final result obeys the buyer's price limit.
7. Confirm that assumptions and future ideas are labeled.
8. Confirm responsive behavior at common desktop, tablet, and mobile widths.
9. Confirm keyboard use, focus states, contrast, and reduced motion behavior.
10. Run tests, type checks, linting, and the production build available in the repository.
11. Summarize the files changed, the behavior implemented, and any remaining limitations.

Build the complete working website now.
