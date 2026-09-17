import { Button, IllustrativeMark, Panel, Section, StatusLabel } from '@/components/ui'
import {
  COMPATIBILITY_EXAMPLES,
  FLOW_STEPS,
  PROBLEM_COLUMNS,
  REVENUE_LINES,
  ROADMAP,
} from '@/data/content'
import {
  DEMO_ASSUMPTIONS,
  FUTURE_IDEAS,
  MVP_BOUNDARIES,
  OPEN_QUESTIONS,
  PILOT_HYPOTHESES,
  RECOMMENDED_DIRECTION,
} from '@/data/scope'
import styles from './sections.module.css'

/* 1. Hero ----------------------------------------------------------------- */

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <h1>Fill compatible production capacity with committed demand.</h1>
        <p className={styles.heroLede}>
          A manufacturer has a production run already scheduled and some approved capacity left on
          it. A smaller buyer has a repeat order too small to reach production pricing on its own.
          SupplyWeave privately matches the two before the run&apos;s cutoff, and returns a delivered
          price, a delivery window and a production status.
        </p>
        <div className={styles.heroActions}>
          <Button onClick={() => scrollToSection('demo')}>See how a match works</Button>
          <Button variant="quiet" onClick={() => scrollToSection('supplier')}>
            I run a facility
          </Button>
        </div>
        <dl className={styles.heroMeta}>
          <div className={styles.heroMetaItem}>
            <dt>For buyers</dt>
            <dd>
              Get production scale pricing without meeting the whole production minimum yourself.
            </dd>
          </div>
          <div className={styles.heroMetaItem}>
            <dt>For manufacturers</dt>
            <dd>Fill the rest of a compatible run with committed, qualified orders.</dd>
          </div>
        </dl>
      </div>
    </header>
  )
}

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  target?.focus?.()
}

/* 2. Problem -------------------------------------------------------------- */

export function Problem() {
  return (
    <Section
      id="problem"
      title="Capacity goes unused on one side, scale goes unreached on the other"
      tinted
    >
      <div className={styles.twoColumn}>
        {PROBLEM_COLUMNS.map((column) => (
          <div key={column.id}>
            <h3>{column.heading}</h3>
            <p className={styles.columnBody}>{column.body}</p>
          </div>
        ))}
      </div>
      <p className={styles.problemClose}>
        Neither side lacks a supplier or a customer. What they lack is a way to discover that they
        fit, check the economics, and commit inside the few days the run stays open.
      </p>
    </Section>
  )
}

/* 5. Buyer and system lanes ----------------------------------------------- */

export function UserSystemFlow() {
  return (
    <Section
      id="flow"
      title="What you do, and what SupplyWeave does"
      intro="Five steps. Your side is on the left, the system's side is on the right."
    >
      <div className={styles.flowGrid}>
        <div className={styles.flowHeader}>
          <StatusLabel word="What you do" shape="filled-square" />
        </div>
        <div className={styles.flowHeader}>
          <StatusLabel word="What SupplyWeave does" shape="outline-square" tone="muted" />
        </div>

        {FLOW_STEPS.map((step, index) => (
          <div className={styles.flowRow} key={step.id}>
            <div className={styles.flowCell}>
              <p className={styles.flowStepNumber}>Step {index + 1}, you</p>
              <p className={styles.flowText}>{step.buyer}</p>
            </div>
            <div className={styles.flowCell}>
              <p className={styles.flowStepNumber}>Step {index + 1}, SupplyWeave</p>
              <p className={`${styles.flowText} ${styles.flowSystem}`}>{step.system}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* 6. Compatibility --------------------------------------------------------- */

export function CompatibilityExplainer() {
  return (
    <Section
      id="compatibility"
      title="Looking similar is not the same as being compatible"
      intro="Whether two orders can share a run is decided by the manufacturer, not by SupplyWeave. There are three answers."
      tinted
    >
      <div className={styles.threeColumn}>
        {COMPATIBILITY_EXAMPLES.map((example) => (
          <div
            key={example.id}
            className={`${styles.compatCard} ${
              example.state === 'Partial'
                ? styles.compatCardPartial
                : example.state === 'Not compatible'
                  ? styles.compatCardFalse
                  : ''
            }`}
          >
            <StatusLabel
              word={example.state}
              shape={
                example.state === 'Full'
                  ? 'filled-circle'
                  : example.state === 'Partial'
                    ? 'half-circle'
                    : 'cross-circle'
              }
              tone={
                example.state === 'Full'
                  ? 'positive'
                  : example.state === 'Partial'
                    ? 'caution'
                    : 'negative'
              }
            />
            <h3 className={styles.compatHeading}>{example.heading}</h3>
            <dl className={styles.compatDetail}>
              <dt>Example</dt>
              <dd>{example.example}</dd>
              <dt>Shared</dt>
              <dd>{example.shared}</dd>
              <dt>Separate</dt>
              <dd>{example.separate}</dd>
            </dl>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* 7. Roadmap --------------------------------------------------------------- */

export function Roadmap() {
  return (
    <Section
      id="roadmap"
      title="Supplier software first, network second"
      intro="The first phase is useful to a manufacturer on its own, before any outside buyer exists."
    >
      <ol className={styles.phaseList}>
        {ROADMAP.map((phase) => (
          <li className={styles.phase} key={phase.id}>
            <p className={styles.phaseNumber}>{phase.number}</p>
            <div>
              <h3>{phase.title}</h3>
              <p className={styles.phaseBody}>{phase.body}</p>
              <p className={styles.phaseStatus}>
                <StatusLabel
                  word={phase.status}
                  shape={phase.status === 'Shown in this prototype' ? 'check-circle' : 'dotted-square'}
                  tone={phase.status === 'Shown in this prototype' ? 'positive' : 'muted'}
                />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/* 8. Business model -------------------------------------------------------- */

export function BusinessModel() {
  return (
    <Section
      id="business-model"
      title="How SupplyWeave could make money"
      intro="Every figure below is a working hypothesis for a pilot, not commercial pricing."
      tinted
    >
      <table>
        <caption>
          Possible revenue lines. Buyers pay no membership fee in the simulated launch model.
        </caption>
        <thead>
          <tr>
            <th scope="col">Revenue line</th>
            <th scope="col">How it works</th>
            <th scope="col">Working hypothesis</th>
          </tr>
        </thead>
        <tbody>
          {REVENUE_LINES.map((line) => (
            <tr key={line.id}>
              <th scope="row">{line.title}</th>
              <td>{line.detail}</td>
              <td className={`${styles.revenueFigure} tnum`}>
                {line.figure}
                <br />
                <StatusLabel word="Hypothesis" shape="outline-square" tone="caution" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

/* 9. Scope ----------------------------------------------------------------- */

export function ScopeStatus() {
  return (
    <Section
      id="scope"
      title="What is settled, what is a guess, and what this prototype does not do"
      intro="These are four different kinds of statement, so they are kept in four separate lists."
    >
      <div className={styles.scopeGrid}>
        <ScopeGroup
          heading="Recommended direction"
          word="Settled for now"
          shape="filled-square"
          tone="ink"
          items={RECOMMENDED_DIRECTION.map((item) => ({ id: item.id, text: item.text }))}
        />
        <ScopeGroup
          heading="Pilot hypotheses"
          word="Not yet tested"
          shape="outline-square"
          tone="caution"
          items={PILOT_HYPOTHESES.map((item) => ({
            id: item.id,
            text: item.text,
            figure: item.figure,
          }))}
        />
        <ScopeGroup
          heading="Open questions"
          word="No answer yet"
          shape="question"
          tone="muted"
          items={OPEN_QUESTIONS.map((item) => ({ id: item.id, text: item.text }))}
        />
        <ScopeGroup
          heading="What this prototype does not do"
          word="Out of scope"
          shape="bracket"
          tone="negative"
          items={MVP_BOUNDARIES.map((item) => ({ id: item.id, text: item.text }))}
        />
      </div>

      <div style={{ marginTop: 'var(--space-7)' }}>
        <Panel title="Demo assumptions" status={<IllustrativeMark />}>
          <ul className={styles.scopeList}>
            {DEMO_ASSUMPTIONS.map((assumption) => (
              <li key={assumption.id}>
                <StatusLabel word="Assumption" shape="dotted-square" tone="muted" />
                <span>{assumption.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Panel title="Ideas for later" headingLevel={3}>
          <ul className={styles.scopeList}>
            {FUTURE_IDEAS.map((idea) => (
              <li key={idea.id}>
                <StatusLabel word="Future idea" shape="dotted-square" tone="muted" />
                <span>{idea.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}

function ScopeGroup({
  heading,
  word,
  shape,
  tone,
  items,
}: {
  heading: string
  word: string
  shape: 'filled-square' | 'outline-square' | 'question' | 'bracket'
  tone: 'ink' | 'caution' | 'muted' | 'negative'
  items: { id: string; text: string; figure?: string }[]
}) {
  return (
    <div className={styles.scopeGroup}>
      <div className={styles.scopeHeading}>
        <h3>{heading}</h3>
      </div>
      <ul className={styles.scopeList}>
        {items.map((item) => (
          <li key={item.id}>
            <StatusLabel word={word} shape={shape} tone={tone} />
            <span>
              {item.figure ? <span className={styles.scopeFigure}>{item.figure}</span> : null}
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 10. Closing -------------------------------------------------------------- */

export function Closing() {
  return (
    <Section id="closing" title="Why this is worth building" tinted>
      <div className={styles.closing}>
        <p>
          The waste here is not a missing supplier or a missing customer. It is a scheduled run with
          room left on it, sitting a few days away from a buyer who would have taken that room.
        </p>
        <p>
          Filling it does not require either side to change who they work with. The manufacturer
          keeps its anchor customer and its pricing private. The buyer keeps its current supplier as
          a fallback and pays only if the delivered price beats what it pays today, inside the limit
          it set.
        </p>
        <p>
          That is a narrow promise, and a checkable one. It is also why the first product is
          coordination software for one facility rather than a marketplace for everything.
        </p>
      </div>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>
          SupplyWeave is an explanatory prototype. Every price, quantity, facility and buyer on this
          page is invented. Nothing here processes payments, creates contracts, verifies capacity,
          arranges freight or guarantees savings.
        </p>
        <p>
          <IllustrativeMark />
        </p>
      </div>
    </footer>
  )
}
