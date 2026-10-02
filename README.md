# SupplyWeave

**Live site:** [joshuakeum9-cell.github.io/supplyweave](https://joshuakeum9-cell.github.io/supplyweave/)

An explanatory prototype of a private production run utilization network.

A manufacturer has a production run already scheduled with some approved capacity left on it. A smaller buyer has a repeat order too small to reach production pricing on its own. SupplyWeave privately matches the two before the run's cutoff, and returns a delivered price, a delivery window and a production status.

This is a website that explains a product. It is not the product. Everything runs on local fixture data with no backend, no API keys and no paid services.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Other commands: `npm run build`, `npm run preview`, `npm run lint`, `npm run typecheck`, `npm test`.

## The documented scenario

The demo is deterministic. The default scenario always produces these numbers, and the test suite asserts them.

| Value | Result |
| --- | --- |
| Product component, supplier tier for 20,000 units | $0.3375 per unit |
| Freight and handling, Facility NJ-1 to ZIP 11373 | $0.0290 per unit |
| Disclosed SupplyWeave fee | $0.0075 per unit |
| Final delivered price | $0.3740 per unit |
| Order total | $7,480.00 |
| Buyer baseline total at $0.4300 per unit | $8,600.00 |
| Savings | $1,120.00, or 13.0 percent |
| Matched volume, before and after | 35,000 to 55,000 units |
| Approved capacity remaining | 5,000 units |

Determinism comes from two choices. Money is held as an integer count of ten-thousandths of a dollar, so `0.3375 + 0.029 + 0.0075` is exactly `0.374` rather than a floating point approximation. The demo clock is a fixture date, October 13, 2026, so the three day cutoff behaves the same way forever.

## How it is put together

```
src/domain/    Pure TypeScript. Money, compatibility, pricing, matching, the
               commit engine, the supplier projection. No React, no clock, no network.
src/data/      Typed fixtures: the product, the production window, the buyer
               requirement, standing demand, the eight scenarios, and the scope lists.
src/state/     One reducer over a discriminated union, plus the provider that
               drives the two timed transitions.
src/components/ Presentation only. Components render values the reducer derived;
               none of them compute money.
```

The whole outcome of a commit is computed in one pass before any animation starts. The processing steps only reveal a plan that already exists, so what a visitor sees can never depend on timing. Reduced motion takes the same path with the reveal skipped.

Two privacy projections are enforced at the type level. `toBuyerVisible` returns a type with no `private` key, so no component can render the supplier's tiers, price floor or anchor customer. `toSupplierVisible` removes the buyer's maximum and current delivered price, so no supplier can price against what a buyer will pay. Tests assert that neither projection leaks.

## The eight demo states

A scenario selector at the top of the demo switches between them. All eight run through the same engine.

1. Compatible match that executes
2. Partial compatibility, which needs supplier confirmation
3. Not compatible, with the reasons given
4. Delivered price above the buyer's maximum
5. Full fill that does not fit the remaining capacity
6. Production cutoff already passed
7. Supplier modifies capacity or declines, driven from the supplier view
8. Validation error, loading, empty and reset states

## What this prototype does not do

It does not process payments, create enforceable contracts, verify real factory capacity, arrange freight, underwrite credit, run production grade optimisation, independently certify technical compatibility, or guarantee savings, quality or delivery. Compatibility is treated as already approved by the supplier.

SupplyWeave is not described as an artificial intelligence product anywhere in the interface, and a test asserts that.

## Implementation notes

Three things differ from `docs/ARCHITECTURE.md`, each for a reason found during the build.

- **CSS modules are grouped by area** rather than one per component. Five module files cover the UI primitives, the explainer sections, the demo and the supplier view. One file per component would have meant about 25 near-empty files.
- **The commit action does not appear in the SupplyWeave lane.** Committing is a buyer decision, so putting a button in the system lane contradicted the lane separation the page is built on. The button lives in the buyer lane, and in a sticky summary bar on small screens so it stays next to the numbers.
- **The `floor` guard was renamed `supplierEconomics`.** The word `floor` was reaching buyer-visible data as a key name, which made the strict privacy test fail for a good reason.

## Deployment

`.github/workflows/deploy.yml` runs lint, tests and the production build on Node 20, then deploys `dist` to GitHub Pages. Vite uses `base: './'`, so the build works from any Pages subpath.

Before the first deploy, create the repository and enable Pages with the source set to GitHub Actions.
