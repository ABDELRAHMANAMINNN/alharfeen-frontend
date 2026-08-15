/**
 * الحرفيين — Brand Mark
 *
 * Concept: two interlocking hex-faceted forms, offset and overlapping —
 * reads as two connected "parts" (or two craftsmen shaking hands, abstracted).
 * References mechanical precision (faceted, engineered edges) without
 * resorting to a literal wrench / gear / car silhouette.
 */

type LogoProps = {
  variant?: 'full' | 'icon' | 'wordmark'
  theme?: 'dark' | 'light' | 'mono'
  size?: number
  className?: string
}

function Mark({ theme = 'dark', size = 40 }: { theme: LogoProps['theme']; size?: number }) {
  const bg = theme === 'light' ? '#0b0f19' : '#f59e0b'
  const fg = theme === 'light' ? '#f59e0b' : '#0b0f19'
  const mono = theme === 'mono'

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="شعار الحرفيين">
      <rect width="40" height="40" rx="11" fill={mono ? 'currentColor' : bg} />
      {/* Back facet */}
      <path
        d="M14 11L23 11L27 16.5L23 22L14 22L10 16.5L14 11Z"
        fill={mono ? 'transparent' : fg}
        opacity={mono ? 1 : 0.35}
        stroke={mono ? 'white' : 'none'}
        strokeOpacity={mono ? 0.5 : 1}
      />
      {/* Front facet, offset to overlap — the "connection" */}
      <path
        d="M17 18L26 18L30 23.5L26 29L17 29L13 23.5L17 18Z"
        fill={mono ? 'white' : fg}
      />
    </svg>
  )
}

export default function Logo({ variant = 'full', theme = 'dark', size = 40, className = '' }: LogoProps) {
  if (variant === 'icon') {
    return <Mark theme={theme} size={size} />
  }

  if (variant === 'wordmark') {
    return (
      <span className={`font-extrabold text-brand ${className}`} style={{ fontSize: size * 0.55 }}>
        الحرفيين
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-extrabold text-brand`} style={{ fontSize: size * 0.5 }}>
        الحرفيين
      </span>
      <Mark theme={theme} size={size} />
    </div>
  )
}
