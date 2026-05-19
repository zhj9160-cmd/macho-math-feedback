/**
 * @param {{
 *   options: {value: string, label: string}[],
 *   selected: string[],
 *   onChange: (selected: string[]) => void,
 * }} props
 */
export default function ChipSelect({ options, selected, onChange }) {
  const toggle = (value) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              active
                ? 'bg-navy text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-navy'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
