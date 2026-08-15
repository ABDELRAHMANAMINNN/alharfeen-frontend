import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  trailingIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, trailingIcon, className = '', id, ...rest }, ref) => {
    const inputId = id ?? rest.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-bold text-ink mb-1.5 text-right">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="absolute right-3.5 text-muted">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-12 rounded-control border bg-white px-3.5 text-sm text-ink
              placeholder:text-muted transition-colors
              ${icon ? 'pr-10' : ''} ${trailingIcon ? 'pl-10' : ''}
              ${error ? 'border-error focus:border-error' : 'border-border focus:border-brand'}
              focus:outline-none
              ${className}
            `}
            {...rest}
          />
          {trailingIcon && <span className="absolute left-3.5 text-muted">{trailingIcon}</span>}
        </div>
        {error && <p className="mt-1 text-xs text-error text-right">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
