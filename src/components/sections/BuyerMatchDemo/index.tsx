import { useEffect, useRef } from 'react'
import {
  Button,
  CheckboxField,
  Field,
  IllustrativeMark,
  LaneLabel,
  LiveRegion,
  Note,
  Panel,
  Section,
  StatusLabel,
} from '@/components/ui'
import { stagesAt } from '@/domain/engine'
import { formatTotal, formatUnitPrice, formatUnits } from '@/domain/money'
import { SCENARIOS, scenarioById } from '@/data/scenarios'
import { useDemo } from '@/state/useDemo'
import {
  CommitmentTerms,
  CostComparison,
  Figure,
  MatchedVolume,
  ProcessingSteps,
  ResultFigures,
  WhyThisMatches,
} from './parts'
import styles from './demo.module.css'

const PRODUCT_LABELS: Record<string, string> = {
  base: '12 x 12 x 12 RSC corrugated box, 32 ECT kraft',
  printed: '12 x 12 x 12 RSC box, 32 ECT kraft, 1-color flexo print',
  heavy: '12 x 12 x 12 RSC box, 44 ECT double wall',
}

export function BuyerMatchDemo() {
  const { state, dispatch } = useDemo()
  const scenario = scenarioById(state.scenarioId)
  const resultRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const opportunity =
    state.outcome && (state.outcome.kind === 'opportunity' || state.outcome.kind === 'awaiting_supplier')
      ? state.outcome.opportunity
      : null

  const hasErrors = Object.keys(state.errors).length > 0
  const finished = state.status === 'executed' || state.status === 'not_executed'

  // Move focus to the result when the run finishes, and to the form when a save
  // is rejected, so a keyboard visitor lands where the change happened.
  useEffect(() => {
    if (finished) resultRef.current?.focus()
  }, [finished])

  useEffect(() => {
    if (hasErrors) errorRef.current?.focus()
  }, [hasErrors])

  return (
    <Section
      id="demo"
      title="Follow one production match from start to finish"
      intro="You are a buyer with a repeat order. Everything below is a simulation running on local data, with no service behind it."
    >
      <LiveRegion message={state.announcement} />

      <fieldset className={styles.scenarioBar}>
        <legend className={styles.scenarioLegend}>Choose what to demonstrate</legend>
        <div className={styles.scenarioOptions}>
          {SCENARIOS.map((option) => (
            <label className={styles.scenarioOption} key={option.id}>
              <input
                type="radio"
                name="scenario"
                className={styles.scenarioRadio}
                value={option.id}
                checked={state.scenarioId === option.id}
                onChange={() => dispatch({ type: 'SELECT_SCENARIO', id: option.id })}
              />
              {option.label}
            </label>
          ))}
        </div>
        <p className={styles.scenarioSummary}>{scenario.summary}</p>
      </fieldset>

      <div className={styles.lanes}>
        <div>
          <LaneLabel lane="you" />
          <div className={styles.laneBody} ref={errorRef} tabIndex={-1}>
            <div>
              <h3>Your standing requirement</h3>
              <p className={styles.stageNote}>
                Saved once, then matched against future runs. {PRODUCT_LABELS[state.form.productId]}.
              </p>
            </div>

            <div>
              <Field
                label="Quantity"
                suffix="(units)"
                help="How many units you need in one delivery."
                inputMode="numeric"
                value={state.form.quantity}
                error={state.errors.quantity}
                onChange={(value) => dispatch({ type: 'EDIT_FIELD', name: 'quantity', value })}
              />
              <Field
                label="Destination ZIP"
                help="Where the units are delivered. Freight is priced from the facility to here."
                inputMode="numeric"
                value={state.form.destinationZip}
                error={state.errors.destinationZip}
                onChange={(value) =>
                  dispatch({ type: 'EDIT_FIELD', name: 'destinationZip', value })
                }
              />
              <Field
                label="Your current delivered price"
                suffix="(dollars per unit)"
                help="What this order costs you today, delivered. Used only to show you the difference."
                inputMode="decimal"
                value={state.form.currentDelivered}
                error={state.errors.currentDelivered}
                onChange={(value) =>
                  dispatch({ type: 'EDIT_FIELD', name: 'currentDelivered', value })
                }
              />
              <Field
                label="Maximum acceptable delivered price"
                suffix="(dollars per unit)"
                help="A ceiling, not an offer. Nothing executes above it, and it never becomes the price you pay."
                inputMode="decimal"
                value={state.form.maxDelivered}
                error={state.errors.maxDelivered}
                onChange={(value) => dispatch({ type: 'EDIT_FIELD', name: 'maxDelivered', value })}
              />
              <Field
                label="Minimum fill"
                suffix="(percent)"
                help="100 means all units or none. A lower number allows a partial fill."
                inputMode="numeric"
                value={state.form.minFillPct}
                error={state.errors.minFillPct}
                onChange={(value) => dispatch({ type: 'EDIT_FIELD', name: 'minFillPct', value })}
              />
              <CheckboxField
                label="Allow qualified equivalents"
                help="Let the supplier offer an approved equivalent specification instead of an exact match."
                checked={state.form.allowEquivalents}
                onChange={(checked) =>
                  dispatch({ type: 'EDIT_FIELD', name: 'allowEquivalents', value: checked })
                }
              />
            </div>

            <div className={styles.matchingFields}>
              <h4>What is used to match you</h4>
              <ul className={styles.matchingList}>
                <li>
                  <StatusLabel word="Used" shape="filled-square" />
                  <span>Product specification, quantity, destination and fill rule.</span>
                </li>
                <li>
                  <StatusLabel word="Used" shape="filled-square" />
                  <span>Your maximum delivered price, as a limit on execution only.</span>
                </li>
                <li>
                  <StatusLabel word="Never shared" shape="cross-circle" tone="negative" />
                  <span>Your identity, your current supplier and what you pay today.</span>
                </li>
              </ul>
            </div>

            <div className={styles.actions}>
              <Button onClick={() => dispatch({ type: 'SAVE_REQUIREMENT' })}>
                {state.savedRequirement ? 'Save and search again' : 'Save requirement'}
              </Button>
              {opportunity && (state.status === 'opportunity' || state.status === 'modified') ? (
                <Button variant="secondary" onClick={() => dispatch({ type: 'COMMIT' })}>
                  Commit demo order
                </Button>
              ) : null}
              <Button variant="quiet" onClick={() => dispatch({ type: 'RESET' })}>
                Reset demo
              </Button>
            </div>

            <CheckboxField
              label="Show results immediately"
              help="Skips the staged reveal. This is also what happens automatically if your system asks for reduced motion."
              checked={state.immediateResults}
              onChange={(checked) =>
                dispatch({ type: 'SET_IMMEDIATE_RESULTS', value: checked })
              }
            />
          </div>
        </div>

        <div>
          <LaneLabel lane="system" />
          <div className={styles.laneBody}>
            <SystemLane />
          </div>
        </div>
      </div>

      <div ref={resultRef} tabIndex={-1} />

      {opportunity && !finished ? (
        <div className={styles.stickySummary}>
          <div className={styles.stickyFigures}>
            <span className={`${styles.stickyPrice} tnum`}>
              {formatUnitPrice(opportunity.breakdown.delivered)} per unit
            </span>
            <span>
              {formatUnits(state.savedRequirement?.quantity ?? 0)} units,{' '}
              {formatTotal(
                opportunity.breakdown.delivered * (state.savedRequirement?.quantity ?? 0),
              )}
            </span>
          </div>
          <Button
            onClick={() => dispatch({ type: 'COMMIT' })}
            disabled={state.status === 'awaiting_supplier'}
          >
            Commit demo order
          </Button>
        </div>
      ) : null}
    </Section>
  )
}

function SystemLane() {
  const { state, dispatch, immediate } = useDemo()

  const opportunity =
    state.outcome && (state.outcome.kind === 'opportunity' || state.outcome.kind === 'awaiting_supplier')
      ? state.outcome.opportunity
      : null

  const requirement = state.savedRequirement

  if (state.status === 'requirement') {
    return (
      <Panel title="Nothing searched yet" status={<IllustrativeMark />}>
        <p className={styles.waiting}>
          Save the requirement on the left. SupplyWeave then looks for production windows whose
          supplier has already approved this specification as compatible.
        </p>
        <MatchedVolume
          matched={state.matchedVolume}
          approved={state.window.approvedIncremental}
          immediate={immediate}
        />
      </Panel>
    )
  }

  if (state.status === 'searching') {
    return (
      <Panel title="Searching compatible production windows" status={<IllustrativeMark />}>
        <p className={styles.waiting}>
          Checking supplier approved compatibility, remaining capacity and the cutoff.
        </p>
      </Panel>
    )
  }

  if (state.status === 'no_match') {
    const assessment = state.outcome?.kind === 'no_match' ? state.outcome.assessment : null
    return (
      <Panel title="No compatible production window" status={<IllustrativeMark />}>
        <div className={styles.emptyState}>
          <StatusLabel word="Not compatible" shape="cross-circle" tone="negative" />
          <p>
            There is a scheduled run for a box this size, and it cannot take this requirement.
            Looking similar is not the same as being compatible.
          </p>
          {assessment ? (
            <ul className={styles.reasons}>
              {assessment.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : null}
          <Note>
            Your requirement stays saved. It is matched again whenever a compatible run is scheduled.
          </Note>
        </div>
      </Panel>
    )
  }

  if (state.status === 'committing' && state.plan) {
    return (
      <Panel title="Checking the order" status={<IllustrativeMark />}>
        <ProcessingSteps stages={stagesAt(state.plan, state.revealed)} />
      </Panel>
    )
  }

  if (state.status === 'executed' && state.commitment) {
    const commitment = state.commitment
    return (
      <Panel
        title="Order executed"
        status={
          <StatusLabel word="Executed" shape="check-circle" tone="positive" />
        }
      >
        <IllustrativeMark />
        <ResultFigures commitment={commitment} />
        <MatchedVolume
          matched={state.matchedVolume}
          approved={state.window.approvedIncremental}
          immediate={immediate}
        />
        <dl className={styles.resultList}>
          <div>
            <dt>Quantity</dt>
            <dd className="tnum">{formatUnits(commitment.quantity)} units, filled in full</dd>
          </div>
          <div>
            <dt>Production</dt>
            <dd>
              Facility NJ-1, run of October 19 to 21
              <br />
              <StatusLabel word="Scheduled for production" shape="filled-circle" tone="positive" />
            </dd>
          </div>
          <div>
            <dt>Delivery window</dt>
            <dd>October 26 to 28, 2026</dd>
          </div>
          <div>
            <dt>Your current supplier</dt>
            <dd>Unaffected. This was one order through an additional channel.</dd>
          </div>
        </dl>
        <Note tone="positive">
          The delivered price of {formatUnitPrice(commitment.delivered)} came from the supplier tier
          plus freight and the disclosed fee. Your maximum of{' '}
          {formatUnitPrice(requirement?.maxDelivered ?? 0)} acted as a ceiling and never became the
          price.
        </Note>
        <div className={styles.actions} style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
            Reset demo
          </Button>
        </div>
      </Panel>
    )
  }

  if (state.status === 'not_executed') {
    return <BlockedPanel />
  }

  if (!opportunity || !requirement) return null

  const awaiting = state.status === 'awaiting_supplier'
  const modified = state.status === 'modified'

  return (
    <Panel
      title={awaiting ? 'Opportunity found, supplier confirmation needed' : 'Private production opportunity'}
      status={
        awaiting ? (
          <StatusLabel word="Awaiting supplier" shape="half-circle" tone="caution" />
        ) : (
          <StatusLabel word="Ready to commit" shape="filled-circle" tone="accent" />
        )
      }
    >
      <IllustrativeMark />

      {modified ? (
        <Note tone="caution">
          The supplier changed the terms since you last looked.{' '}
          {state.changedTerms.join('. ')}. Review the numbers again before committing.
        </Note>
      ) : null}

      <div className={styles.figureRow} style={{ marginTop: 'var(--space-5)' }}>
        <Figure label="Facility" value="NJ-1" sub={<span className={styles.stageNote}>Northern New Jersey</span>} />
        <Figure
          label="Production cutoff"
          value="3 days"
          sub={<span className={styles.stageNote}>Closes October 16</span>}
        />
        <Figure
          label="Capacity left"
          value={`${formatUnits(opportunity.remainingBefore)} units`}
        />
      </div>

      <Note>
        The anchor customer on this run, its price and its quantity stay private. You see the
        facility, the remaining capacity and your own delivered cost.
      </Note>

      <div style={{ marginTop: 'var(--space-5)' }}>
        <h4>Why this matches</h4>
        <WhyThisMatches opportunity={opportunity} />
      </div>

      <CostComparison
        breakdown={opportunity.breakdown}
        currentDelivered={requirement.currentDelivered}
        quantity={requirement.quantity}
      />

      {!opportunity.guards.maxPrice ? (
        <Note tone="caution">
          This delivered price is above the maximum you set. You can still run the checks to see
          where the order stops.
        </Note>
      ) : null}

      <CommitmentTerms opportunity={opportunity} />

      <MatchedVolume
        matched={state.matchedVolume}
        approved={state.window.approvedIncremental}
        immediate={immediate}
      />

      {awaiting ? (
        <Note tone="caution">
          Printing is a separate step on this run, so the supplier has to confirm before the price is
          final. Use the supplier view below to approve it.
        </Note>
      ) : (
        <Note>
          Committing is your decision, so the button sits in your lane. Use Commit demo order.
        </Note>
      )}
    </Panel>
  )
}

function BlockedPanel() {
  const { state, dispatch } = useDemo()
  const reason = state.blockReason

  const copy = {
    price_limit: {
      title: 'Nothing was ordered',
      body: 'The delivered price for this run is above the maximum you set, so the order stopped at that check. No units were added to the run and you owe nothing.',
    },
    full_fill: {
      title: 'Nothing was ordered',
      body: 'You asked for a full fill and the run does not have enough approved capacity left for your whole quantity. A partial fill was possible, and your rule does not allow one.',
    },
    cutoff_expired: {
      title: 'This window has closed',
      body: 'The production cutoff passed before this requirement was matched. Once a run is scheduled, nothing more can be added to it.',
    },
    supplier_declined: {
      title: 'The supplier closed this window',
      body: 'The facility withdrew the incremental capacity. Nothing was ordered, and your requirement stays saved for the next compatible run.',
    },
    floor: {
      title: 'Nothing was ordered',
      body: 'The economics did not work for the supplier at this quantity.',
    },
  }[reason ?? 'price_limit']

  return (
    <Panel
      title={copy.title}
      status={<StatusLabel word="Not executed" shape="cross-circle" tone="negative" />}
    >
      <IllustrativeMark />
      <p style={{ marginTop: 'var(--space-4)' }}>{copy.body}</p>

      {state.plan ? (
        <div style={{ marginTop: 'var(--space-5)' }}>
          <ProcessingSteps stages={stagesAt(state.plan, state.revealed)} />
        </div>
      ) : null}

      <Note tone="negative">
        Your current supplier is unaffected. SupplyWeave is an additional channel, so a match that
        does not execute simply means you buy as you normally would.
      </Note>

      <div className={styles.actions} style={{ marginTop: 'var(--space-5)' }}>
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
          Reset demo
        </Button>
      </div>
    </Panel>
  )
}
