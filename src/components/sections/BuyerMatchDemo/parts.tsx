import { useEffect, useRef, useState } from 'react'
import { Disclosure, IllustrativeMark, Shape, StatusLabel } from '@/components/ui'
import {
  formatPercent,
  formatTotal,
  formatUnitPrice,
  formatUnits,
} from '@/domain/money'
import type {
  Commitment,
  DeliveredCostBreakdown,
  MatchedOpportunity,
  Money4,
  ProcessingStage,
  Units,
} from '@/domain/types'
import styles from './demo.module.css'

export function Figure({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: React.ReactNode
}) {
  return (
    <div className={styles.figure}>
      <span className={styles.figureLabel}>{label}</span>
      <span className={`${styles.figureValue} tnum`}>{value}</span>
      {sub}
    </div>
  )
}

/**
 * Counts from the previous matched volume to the new one. The animation only
 * shows a change that has already happened in state, and it is skipped entirely
 * when motion is reduced.
 */
function useCountUp(target: number, immediate: boolean): number {
  const [display, setDisplay] = useState(target)
  const previous = useRef(target)

  useEffect(() => {
    const from = previous.current
    previous.current = target

    if (immediate || from === target) {
      setDisplay(target)
      return
    }

    const durationMs = 600
    let frame = 0
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min(1, (timestamp - start) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, immediate])

  return display
}

export function MatchedVolume({
  matched,
  approved,
  immediate,
}: {
  matched: Units
  approved: Units
  immediate: boolean
}) {
  const shown = useCountUp(matched, immediate)
  const remaining = Math.max(0, approved - shown)
  const percent = approved > 0 ? Math.min(100, (shown / approved) * 100) : 0

  return (
    <div>
      <div className={styles.figureRow}>
        <Figure label="Matched so far" value={`${formatUnits(shown)} units`} />
        <Figure label="Approved for this run" value={`${formatUnits(approved)} units`} />
      </div>
      <div className={styles.capacityBar} aria-hidden="true">
        <div className={styles.capacityFilled} style={{ width: `${percent}%` }} />
        <div className={styles.capacityRemaining} />
      </div>
      <p className={styles.capacityLegend}>
        <StatusLabel word={`Matched ${formatUnits(shown)}`} shape="filled-square" />
        <StatusLabel word={`Remaining ${formatUnits(remaining)}`} shape="outline-square" tone="muted" />
      </p>
    </div>
  )
}

export function WhyThisMatches({ opportunity }: { opportunity: MatchedOpportunity }) {
  const { assessment } = opportunity
  const isFull = assessment.state === 'full'

  return (
    <div>
      <StatusLabel
        word={isFull ? 'Full compatibility' : 'Partial compatibility'}
        shape={isFull ? 'filled-circle' : 'half-circle'}
        tone={isFull ? 'positive' : 'caution'}
      />
      <ul className={styles.reasons} style={{ marginTop: 'var(--space-3)' }}>
        {assessment.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      {assessment.separateSteps.length > 0 ? (
        <p className={styles.stageNote}>
          Separate steps: {assessment.separateSteps.join(', ')}.
        </p>
      ) : null}
      <p className={styles.stageNote}>
        Compatibility here is supplier approved demo data. SupplyWeave does not certify it.
      </p>
    </div>
  )
}

export function CostComparison({
  breakdown,
  currentDelivered,
  quantity,
}: {
  breakdown: DeliveredCostBreakdown
  currentDelivered: Money4
  quantity: Units
}) {
  const baselineTotal = currentDelivered * quantity
  const newTotal = breakdown.delivered * quantity
  const savings = baselineTotal - newTotal
  const savingsPct = baselineTotal > 0 ? Math.round((savings / baselineTotal) * 1000) / 10 : 0
  const cheaper = savings > 0

  return (
    <div className={styles.comparison}>
      <table>
        <caption>
          Delivered cost for {formatUnits(quantity)} units. Illustrative demo data.
        </caption>
        <tbody>
          <tr>
            <th scope="row">
              What you pay today
              <br />
              <StatusLabel word="Your current delivered price" shape="outline-square" tone="muted" />
            </th>
            <td className={`${styles.comparisonValue} tnum`}>{formatUnitPrice(currentDelivered)}</td>
            <td className="tnum">{formatTotal(baselineTotal)}</td>
          </tr>
          <tr>
            <th scope="row">
              Through this production window
              <br />
              <StatusLabel word="Delivered price" shape="filled-square" />
            </th>
            <td className={`${styles.comparisonValue} tnum`}>
              {formatUnitPrice(breakdown.delivered)}
            </td>
            <td className="tnum">{formatTotal(newTotal)}</td>
          </tr>
          <tr className={styles.savingsRow}>
            <th scope="row">
              {cheaper ? 'You save' : 'Difference'}
              <br />
              <StatusLabel
                word={cheaper ? 'Lower delivered cost' : 'Higher delivered cost'}
                shape={cheaper ? 'check-circle' : 'cross-circle'}
                tone={cheaper ? 'positive' : 'negative'}
              />
            </th>
            <td className={`${styles.comparisonValue} tnum`}>{formatPercent(Math.abs(savingsPct))}</td>
            <td className="tnum">{formatTotal(Math.abs(savings))}</td>
          </tr>
        </tbody>
      </table>
      <PriceBreakdown breakdown={breakdown} quantity={quantity} />
    </div>
  )
}

export function PriceBreakdown({
  breakdown,
  quantity,
}: {
  breakdown: DeliveredCostBreakdown
  quantity: Units
}) {
  return (
    <Disclosure summary="How this delivered price is built">
      <table>
        <caption>Per unit, and for {formatUnits(quantity)} units. Illustrative demo data.</caption>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Per unit</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Product, at the supplier tier for this quantity</th>
            <td className="tnum">{formatUnitPrice(breakdown.product)}</td>
            <td className="tnum">{formatTotal(breakdown.product * quantity)}</td>
          </tr>
          <tr>
            <th scope="row">Freight and handling to your destination</th>
            <td className="tnum">{formatUnitPrice(breakdown.freightHandling)}</td>
            <td className="tnum">{formatTotal(breakdown.freightHandling * quantity)}</td>
          </tr>
          <tr>
            <th scope="row">Disclosed SupplyWeave fee</th>
            <td className="tnum">{formatUnitPrice(breakdown.fee)}</td>
            <td className="tnum">{formatTotal(breakdown.fee * quantity)}</td>
          </tr>
          <tr className={styles.breakdownTotal}>
            <th scope="row">Delivered</th>
            <td className="tnum">{formatUnitPrice(breakdown.delivered)}</td>
            <td className="tnum">{formatTotal(breakdown.delivered * quantity)}</td>
          </tr>
        </tbody>
      </table>
      <p className={styles.stageNote}>
        Your maximum acceptable delivered price is a limit, not the price. The supplier sets its own
        tiers and a confidential floor, neither of which is shown to you, and the order only executes
        if the result lands inside both.
      </p>
    </Disclosure>
  )
}

export function CommitmentTerms({ opportunity }: { opportunity: MatchedOpportunity }) {
  return (
    <Disclosure summary="What you are agreeing to">
      <dl className={styles.termList}>
        {opportunity.terms.map((term) => (
          <div key={term.id}>
            <dt>
              {term.label}
              {term.assumption ? (
                <>
                  <br />
                  <StatusLabel word="Demo assumption" shape="dotted-square" tone="muted" />
                </>
              ) : null}
            </dt>
            <dd>{term.value}</dd>
          </div>
        ))}
      </dl>
    </Disclosure>
  )
}

const STAGE_STATUS = {
  waiting: { word: 'Waiting', shape: 'empty-circle', tone: 'muted' },
  running: { word: 'Running', shape: 'half-circle', tone: 'accent' },
  done: { word: 'Done', shape: 'check-circle', tone: 'positive' },
  blocked: { word: 'Blocked', shape: 'cross-circle', tone: 'negative' },
} as const

export function ProcessingSteps({ stages }: { stages: ProcessingStage[] }) {
  return (
    <ol className={styles.stageList}>
      {stages.map((stage) => {
        const status = STAGE_STATUS[stage.status]
        return (
          <li
            key={stage.id}
            className={`${styles.stage} ${stage.status === 'waiting' ? styles.stageWaiting : ''}`}
          >
            <StatusLabel word={status.word} shape={status.shape} tone={status.tone} />
            <div>
              <p className={styles.stageLabel}>{stage.label}</p>
              {stage.note && stage.status !== 'waiting' ? (
                <p className={styles.stageNote}>{stage.note}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function ResultFigures({ commitment }: { commitment: Commitment }) {
  return (
    <div className={styles.resultFigures}>
      <Figure label="Final delivered price" value={formatUnitPrice(commitment.delivered)} />
      <Figure label="Order total" value={formatTotal(commitment.total)} />
      <Figure label="You save" value={formatTotal(commitment.savings)} />
      <Figure label="Against your current price" value={formatPercent(commitment.savingsPct)} />
    </div>
  )
}

export function IllustrativeHeader() {
  return (
    <span>
      <IllustrativeMark />
    </span>
  )
}

export { Shape }
