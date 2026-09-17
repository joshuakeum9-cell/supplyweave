import {
  Button,
  Disclosure,
  Field,
  IllustrativeMark,
  LaneLabel,
  Note,
  Panel,
  Section,
  StatusLabel,
} from '@/components/ui'
import { formatTotal, formatUnits } from '@/domain/money'
import { supplierResults } from '@/domain/supplier'
import { STANDING_DEMAND } from '@/data/standingDemand'
import { useDemo } from '@/state/useDemo'
import styles from './supplier.module.css'

export function SupplierWindow() {
  const { state, dispatch } = useDemo()
  const results = supplierResults(state.window, STANDING_DEMAND)
  const { form, saved, decision } = state.supplier

  return (
    <Section
      id="supplier"
      title="The same run, from the facility side"
      intro="A manufacturer opens a private production window on a run it has already scheduled, then sees what compatible demand exists for the capacity it has approved."
      tinted
    >
      <div className={styles.columns}>
        <div>
          <LaneLabel lane="you" />
          <h3>Your production window</h3>
          <p className={styles.note}>
            Nothing here is public. Competing facilities never see this window, and buyers never see
            your tiers or your floor.
          </p>

          <div className={styles.form}>
            <Field
              label="Approved incremental capacity"
              suffix="(units)"
              help="How much extra volume this run may take on top of your existing customer's order."
              inputMode="numeric"
              value={form.approvedIncremental}
              onChange={(value) =>
                dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'approvedIncremental', value })
              }
            />
            <Field
              label="Minimum additional quantity"
              suffix="(units)"
              help="Below this, an extra order is not worth scheduling."
              inputMode="numeric"
              value={form.minAdditional}
              onChange={(value) =>
                dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'minAdditional', value })
              }
            />
            <Field
              label="Production cutoff"
              type="date"
              help="After this date the run is locked and nothing more can join it."
              value={form.cutoff}
              onChange={(value) => dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'cutoff', value })}
            />
            <Field
              label="Your price for 20,000 units and above"
              suffix="(dollars per unit, private)"
              help="Private to you. Buyers see a delivered price, never your tier."
              inputMode="decimal"
              value={form.tierPrice}
              onChange={(value) => dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'tierPrice', value })}
            />
            <Field
              label="Price floor"
              suffix="(dollars per unit, private)"
              help="Nothing executes below this, whatever a buyer is willing to pay."
              inputMode="decimal"
              value={form.floor}
              onChange={(value) => dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'floor', value })}
            />
            <Field
              label="Service region"
              help="Where you will deliver from this facility."
              value={form.serviceRegion}
              onChange={(value) =>
                dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'serviceRegion', value })
              }
            />
            <Field
              label="Delivery terms"
              value={form.deliveryTerms}
              onChange={(value) =>
                dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'deliveryTerms', value })
              }
            />
            <Field
              label="Quality and certification requirements"
              value={form.quality}
              onChange={(value) => dispatch({ type: 'EDIT_WINDOW_FIELD', name: 'quality', value })}
            />

            <Disclosure summary="Compatibility rules for this run">
              <dl className={styles.specList}>
                <div>
                  <dt>Product family</dt>
                  <dd>{state.window.productFamily}</dd>
                </div>
                <div>
                  <dt>Board and wall</dt>
                  <dd>
                    {state.window.compatibility.boardGrade}, {state.window.compatibility.wall} wall,
                    flute {state.window.compatibility.flute}
                  </dd>
                </div>
                <div>
                  <dt>Die</dt>
                  <dd>
                    {state.window.compatibility.style} {state.window.compatibility.dimensionsIn}
                  </dd>
                </div>
                <div>
                  <dt>Print and finishing</dt>
                  <dd>
                    {state.window.compatibility.print === 'none'
                      ? 'Unprinted'
                      : state.window.compatibility.print}
                    , {state.window.compatibility.finishing}
                  </dd>
                </div>
              </dl>
              <p className={styles.note}>
                A requirement only counts as compatible when it matches these. You approve the rules,
                SupplyWeave applies them.
              </p>
            </Disclosure>

            <div className={styles.actions}>
              <Button onClick={() => dispatch({ type: 'SAVE_WINDOW' })}>
                Save production window
              </Button>
              {saved ? <StatusLabel word="Saved" shape="check-circle" tone="positive" /> : null}
            </div>
          </div>
        </div>

        <div>
          <LaneLabel lane="system" />
          <Panel title="Compatible demand for this window" status={<IllustrativeMark />}>
            <dl className={styles.resultList}>
              <div>
                <dt>Compatible standing demand found</dt>
                <dd className="tnum">
                  {results.compatibleCount} requirements, {formatUnits(results.compatibleUnits)}{' '}
                  units
                </dd>
              </div>
              <div>
                <dt>Approved capacity remaining</dt>
                <dd className="tnum">{formatUnits(results.remainingBefore)} units</dd>
              </div>
              <div>
                <dt>Consolidated supplemental order</dt>
                <dd className="tnum">
                  {formatUnits(results.acceptedUnits)} units from {results.acceptedRows.length}{' '}
                  buyer{results.acceptedRows.length === 1 ? '' : 's'}
                </dd>
              </div>
              <div>
                <dt>Estimated incremental revenue</dt>
                <dd className="tnum">{formatTotal(results.productValue)} of product value</dd>
              </div>
              <div>
                <dt>Manifest</dt>
                <dd>
                  {results.destinations.length > 0
                    ? `${results.destinations.length} destination, ZIP ${results.destinations.join(', ')}`
                    : 'No destinations yet'}
                </dd>
              </div>
            </dl>

            <table className={styles.demandTable}>
              <caption>
                Buyers appear as labels. You never see a buyer&apos;s identity, its current supplier
                or what it is willing to pay. Illustrative demo data.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Buyer</th>
                  <th scope="col">Units</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Fits this run</th>
                </tr>
              </thead>
              <tbody>
                {results.rows.map((row) => (
                  <tr key={row.buyerLabel}>
                    <th scope="row">{row.buyerLabel}</th>
                    <td className="tnum">{formatUnits(row.quantity)}</td>
                    <td>{row.destinationZip3}</td>
                    <td>
                      <StatusLabel
                        word={row.fits ? 'Fits' : 'Does not fit'}
                        shape={row.fits ? 'check-circle' : 'cross-circle'}
                        tone={row.fits ? 'positive' : 'negative'}
                      />
                      <br />
                      <span className={styles.note}>{row.note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Note>
              Your existing customer&apos;s order, price and schedule are not part of this view and
              are never shared with anyone matched here.
            </Note>

            <h4 className={styles.controlsHeading}>Your decision</h4>
            <div className={styles.actions}>
              <Button onClick={() => dispatch({ type: 'SUPPLIER_APPROVE' })}>Approve</Button>
              <Button variant="secondary" onClick={() => dispatch({ type: 'SUPPLIER_MODIFY' })}>
                Modify capacity
              </Button>
              <Button variant="secondary" onClick={() => dispatch({ type: 'SUPPLIER_DECLINE' })}>
                Decline and close
              </Button>
            </div>
            {decision !== 'none' ? (
              <p className={styles.decision}>
                <StatusLabel
                  word={
                    decision === 'approved'
                      ? 'Approved'
                      : decision === 'declined'
                        ? 'Declined and closed'
                        : 'Capacity reduced to 15,000 units'
                  }
                  shape={
                    decision === 'approved'
                      ? 'check-circle'
                      : decision === 'declined'
                        ? 'cross-circle'
                        : 'half-circle'
                  }
                  tone={
                    decision === 'approved'
                      ? 'positive'
                      : decision === 'declined'
                        ? 'negative'
                        : 'caution'
                  }
                />
                <span className={styles.note}>
                  {' '}
                  The buyer demo above has been updated to match this decision.
                </span>
              </p>
            ) : null}
          </Panel>
        </div>
      </div>
    </Section>
  )
}
