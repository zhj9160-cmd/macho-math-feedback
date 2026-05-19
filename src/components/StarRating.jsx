import { useState } from 'react'
import { Star } from 'lucide-react'

const SIZE_MAP = { sm: 16, md: 22, lg: 30 }

/**
 * @param {{
 *   value: number,
 *   onChange: (v: number) => void,
 *   max?: number,
 *   size?: 'sm'|'md'|'lg',
 * }} props
 */
export default function StarRating({ value, onChange, max = 5, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const px = SIZE_MAP[size] ?? SIZE_MAP.md
  const display = hovered || value

  return (
    <div
      className="flex gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
      role="group"
      aria-label="별점 선택"
      tabIndex={0}
      onKeyDown={(e) => {
        const n = parseInt(e.key, 10)
        if (n >= 1 && n <= max) onChange(n)
      }}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const active = star <= display
        return (
          <Star
            key={star}
            size={px}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className={`transition-colors ${
              active
                ? 'text-gold fill-gold'
                : 'text-gray-300 fill-transparent'
            }`}
          />
        )
      })}
    </div>
  )
}
