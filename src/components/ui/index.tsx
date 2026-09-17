import {
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { Shape, type ShapeKind } from './Shape'
import styles from './ui.module.css'

/* Layout ------------------------------------------------------------------ */

export function Section({
  id,
  title,
  intro,
  tinted = false,
  headingLevel = 2,
  children,
}: {
  id: string
  title: string
  intro?: ReactNode
  tinted?: boolean
  headingLevel?: 2 | 3
  children: ReactNode
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <section
      id={id}
      className={`${styles.section} ${tinted ? styles.sectionTinted : ''}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className={styles.sectionInner}>
        <div className={styles.sectionHeader}>
          <Heading id={`${id}-heading`}>{title}</Heading>
          {intro ? <p className={styles.sectionIntro}>{intro}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

export function Panel({
  title,
  status,
  children,
  headingLevel = 3,
}: {
  title: string
  status?: ReactNode
  children: ReactNode
  headingLevel?: 3 | 4
}) {
  const Heading = headingLevel === 3 ? 'h3' : 'h4'
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Heading>{title}</Heading>
        {status}
      </div>
      {children}
    </div>
  )
}

export function Note({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'caution' | 'negative' | 'positive'
  children: ReactNode
}) {
  const toneClass =
    tone === 'caution'
      ? styles.noteCaution
      : tone === 'negative'
        ? styles.noteNegative
        : tone === 'positive'
          ? styles.notePositive
          : ''
  return <p className={`${styles.note} ${toneClass}`}>{children}</p>
}

/* Buttons ----------------------------------------------------------------- */

export function Button({
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  children,
}: {
  variant?: 'primary' | 'secondary' | 'quiet'
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
}) {
  const variantClass =
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.quiet
  return (
    <button
      type={type}
      className={`${styles.button} ${variantClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

/* Form fields -------------------------------------------------------------- */

export function Field({
  label,
  help,
  error,
  value,
  onChange,
  type = 'text',
  inputMode,
  suffix,
}: {
  label: string
  help?: string
  error?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'date'
  inputMode?: 'numeric' | 'decimal'
  suffix?: string
}) {
  const id = useId()
  const helpId = `${id}-help`
  const errorId = `${id}-error`
  const describedBy = [help ? helpId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {suffix ? <span className={styles.help}> {suffix}</span> : null}
      </label>
      {help ? (
        <span className={styles.help} id={helpId}>
          {help}
        </span>
      ) : null}
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        value={value}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
      {error ? (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function CheckboxField({
  label,
  help,
  checked,
  onChange,
}: {
  label: string
  help?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const id = useId()
  const helpId = `${id}-help`
  return (
    <div className={styles.checkboxRow}>
      <input
        id={id}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        aria-describedby={help ? helpId : undefined}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        {help ? (
          <span className={styles.help} id={helpId}>
            <br />
            {help}
          </span>
        ) : null}
      </span>
    </div>
  )
}

/* Status ------------------------------------------------------------------- */

export type StatusTone = 'ink' | 'muted' | 'positive' | 'caution' | 'negative' | 'accent'

export function StatusLabel({
  word,
  shape,
  tone = 'ink',
}: {
  word: string
  shape: ShapeKind
  tone?: StatusTone
}) {
  const toneClass = {
    ink: styles.statusInk,
    muted: styles.statusMuted,
    positive: styles.statusPositive,
    caution: styles.statusCaution,
    negative: styles.statusNegative,
    accent: styles.statusAccent,
  }[tone]

  return (
    <span className={`${styles.status} ${toneClass}`}>
      <Shape kind={shape} />
      {word}
    </span>
  )
}

export function LaneLabel({ lane }: { lane: 'you' | 'system' }) {
  return (
    <p className={`${styles.lane} ${lane === 'system' ? styles.laneSystem : ''}`}>
      <Shape kind={lane === 'you' ? 'filled-square' : 'outline-square'} />
      {lane === 'you' ? 'What you do' : 'What SupplyWeave does'}
    </p>
  )
}

export function IllustrativeMark() {
  return (
    <span className={styles.illustrative}>
      <Shape kind="dotted-square" />
      Illustrative demo data
    </span>
  )
}

/* Disclosure --------------------------------------------------------------- */

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className={styles.disclosure}>
      <button
        type="button"
        className={styles.disclosureButton}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <Shape kind="chevron" />
        </span>
        {summary}
      </button>
      {open ? (
        <div className={styles.disclosureBody} id={id}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

/* Live region -------------------------------------------------------------- */

export function LiveRegion({ message }: { message: string }) {
  return (
    <p className="visually-hidden" role="status" aria-live="polite">
      {message}
    </p>
  )
}

export { Shape }
export type { ShapeKind }
