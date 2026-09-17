import type {
  DemoAssumption,
  FutureIdea,
  MvpBoundary,
  OpenQuestion,
  PilotHypothesis,
  RecommendedDirection,
} from '@/domain/types'

/**
 * Five separate arrays, one per kind. They are never merged, so a pilot
 * hypothesis cannot be rendered in the same list as a settled direction, and an
 * open question is never shown as an answer.
 */

export const RECOMMENDED_DIRECTION: RecommendedDirection[] = [
  { id: 'rd-1', text: 'Supplier software first, demand network second.' },
  { id: 'rd-2', text: 'Private matching. No public bidding and no public factory schedule.' },
  { id: 'rd-3', text: 'Standing buyer requirements rather than one-off searches.' },
  { id: 'rd-4', text: 'Compatibility is approved by the supplier, not asserted by the platform.' },
  { id: 'rd-5', text: 'Compare delivered cost, not factory price alone.' },
  { id: 'rd-6', text: 'No requirement for a buyer to switch suppliers.' },
  { id: 'rd-7', text: 'One narrow product category at launch.' },
]

export const PILOT_HYPOTHESES: PilotHypothesis[] = [
  {
    id: 'ph-1',
    text: 'Buyers may need roughly 10 percent delivered savings to justify trying a new channel.',
    figure: 'About 10 percent',
  },
  {
    id: 'ph-2',
    text: 'A success fee on genuinely new incremental business may be viable.',
    figure: '4 to 6 percent',
  },
  {
    id: 'ph-3',
    text: 'Supplier production coordination software may support a monthly facility subscription.',
    figure: '$500 to $2,000 per facility per month',
  },
  {
    id: 'ph-4',
    text: 'Higher value repeat orders are more attractive to both sides than very small transactions.',
  },
]

export const OPEN_QUESTIONS: OpenQuestion[] = [
  { id: 'oq-1', text: 'First product category.' },
  { id: 'oq-2', text: 'Initial geography.' },
  { id: 'oq-3', text: 'Exact supplier contract and fee.' },
  { id: 'oq-4', text: 'Who procures freight.' },
  { id: 'oq-5', text: 'Quality remedies and the inspection process.' },
  { id: 'oq-6', text: 'Cancellation and deposit rules.' },
  { id: 'oq-7', text: 'Minimum transaction size.' },
  { id: 'oq-8', text: 'Exact subscription pricing.' },
]

export const MVP_BOUNDARIES: MvpBoundary[] = [
  { id: 'mb-1', text: 'Does not process payments.' },
  { id: 'mb-2', text: 'Does not create enforceable purchase contracts.' },
  { id: 'mb-3', text: 'Does not verify real factory capacity.' },
  { id: 'mb-4', text: 'Does not arrange freight.' },
  { id: 'mb-5', text: 'Does not underwrite buyer credit.' },
  { id: 'mb-6', text: 'Does not run production grade optimisation.' },
  { id: 'mb-7', text: 'Does not independently certify technical compatibility.' },
  { id: 'mb-8', text: 'Does not guarantee savings, quality or delivery.' },
]

export const DEMO_ASSUMPTIONS: DemoAssumption[] = [
  {
    id: 'da-1',
    text: 'Every price, quantity, facility, buyer and date on this page is invented for the demonstration.',
  },
  {
    id: 'da-2',
    text: 'Compatibility here is treated as already approved by the supplier. The prototype does not assess it.',
  },
  {
    id: 'da-3',
    text: 'The demo clock is fixed at October 13, 2026, so the three day cutoff always behaves the same way.',
  },
  {
    id: 'da-4',
    text: 'Freight and handling is a flat per unit rate by destination. Real freight is quoted per shipment.',
  },
  {
    id: 'da-5',
    text: 'The disclosed fee shown in the demo, $0.0075 per unit, is about 2.2 percent of the product cost. It sits below the 4 to 6 percent success fee hypothesis and is used only to keep the arithmetic simple.',
  },
  {
    id: 'da-6',
    text: 'Cancellation is free until the cutoff in this demo. Real terms are an open question.',
  },
]

export const FUTURE_IDEAS: FutureIdea[] = [
  {
    id: 'fi-1',
    text: 'Cross manufacturer routing: comparing qualified opportunities across several facilities once repeat transactions are proven.',
  },
  { id: 'fi-2', text: 'Payment protection, financing and faster supplier payout.' },
  { id: 'fi-3', text: 'Managed freight.' },
  { id: 'fi-4', text: 'Integrations with the systems buyers and suppliers already run.' },
]
