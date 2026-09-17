import styles from './ui.module.css'

export type ShapeKind =
  | 'filled-square'
  | 'outline-square'
  | 'dotted-square'
  | 'filled-circle'
  | 'empty-circle'
  | 'half-circle'
  | 'check-circle'
  | 'cross-circle'
  | 'question'
  | 'bracket'
  | 'chevron'

/**
 * A small shape that travels with every status word. Colour is never the only
 * signal: the word carries the meaning and the shape repeats it, so the
 * interface still reads correctly in monochrome or with a colour vision
 * difference.
 */
export function Shape({ kind, size = 14 }: { kind: ShapeKind; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    'aria-hidden': true,
    focusable: false,
    className: styles.shape,
  } as const

  switch (kind) {
    case 'filled-square':
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" rx="1" fill="currentColor" />
        </svg>
      )
    case 'outline-square':
      return (
        <svg {...common}>
          <rect
            x="2.75"
            y="2.75"
            width="10.5"
            height="10.5"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )
    case 'dotted-square':
      return (
        <svg {...common}>
          <rect
            x="2.75"
            y="2.75"
            width="10.5"
            height="10.5"
            rx="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2.5 2"
          />
        </svg>
      )
    case 'filled-circle':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      )
    case 'empty-circle':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'half-circle':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 2.75a5.25 5.25 0 0 1 0 10.5z" fill="currentColor" />
        </svg>
      )
    case 'check-circle':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
          <path
            d="M5 8.2l2 2 4-4.4"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'cross-circle':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
          <path
            d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'question':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.4 6.2a1.7 1.7 0 1 1 2 1.7v1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8.4" cy="11.3" r="0.9" fill="currentColor" />
        </svg>
      )
    case 'bracket':
      return (
        <svg {...common}>
          <path
            d="M6 3H3.5v10H6M10 3h2.5v10H10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...common}>
          <path
            d="M6 3.5L10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
