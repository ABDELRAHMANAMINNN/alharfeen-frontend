import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-ink hover:bg-brand-dark active:scale-[0.98]',
  secondary: 'bg-white text-ink border border-border hover:bg-surface active:scale-[0.98]',
  ghost: 'bg-transparent text-ink hover:bg-surface active:scale-[0.98]',
  danger: 'bg-error text-white hover:opacity-90 active:scale-[0.98]',
  dark: 'bg-ink text-body hover:bg-ink-2 active:scale-[0.98]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3.5 gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-control font-bold
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
