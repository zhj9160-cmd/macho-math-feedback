/**
 * @param {{
 *   value: number,
 *   onChange: (v: number) => void,
 *   min?: number,
 *   max?: number,
 *   step?: number,
 *   suffix?: string,
 * }} props
 */
export default function Slider({ value, onChange, min = 0, max = 100, step = 1, suffix = '%' }) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 rounded-full appearance-none cursor-pointer slider-input"
        style={{
          background: `linear-gradient(to right, #1B365D ${percent}%, #E5E7EB ${percent}%)`,
        }}
      />
      <span className="text-sm font-semibold text-navy w-14 text-right tabular-nums">
        {value}{suffix}
      </span>
    </div>
  )
}
