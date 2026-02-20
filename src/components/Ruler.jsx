import { useState, useRef, useCallback, useEffect } from 'react'

const RULER_LENGTH_CM = 190
const CM_PER_TICK = 1
const MAJOR_EVERY = 10  // label every 10 cm
const PX_PER_CM = 4.5   // pixels per cm on screen

export default function Ruler({ onClose }) {
  const [position, setPosition] = useState({ x: 40, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const rulerRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    // Only drag from the badge area, not the ruler body (so user can still scroll)
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragStart.current = { x: clientX - position.x, y: clientY - position.y }
  }, [position])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleMouseMove, { passive: false })
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const totalWidth = RULER_LENGTH_CM * PX_PER_CM
  const ticks = []

  for (let cm = 0; cm <= RULER_LENGTH_CM; cm += CM_PER_TICK) {
    const isMajor = cm % MAJOR_EVERY === 0
    const isMid = cm % 5 === 0 && !isMajor
    const x = cm * PX_PER_CM

    let tickHeight = 6
    if (isMid) tickHeight = 10
    if (isMajor) tickHeight = 16

    ticks.push(
      <g key={cm}>
        <line
          x1={x} y1={0} x2={x} y2={tickHeight}
          stroke="#444" strokeWidth={isMajor ? 0.8 : 0.5}
        />
        <line
          x1={x} y1={40 - tickHeight} x2={x} y2={40}
          stroke="#444" strokeWidth={isMajor ? 0.8 : 0.5}
        />
        {isMajor && (
          <text
            x={x} y={26}
            textAnchor="middle"
            fontSize="8"
            fontFamily="Arial, sans-serif"
            fill="#333"
            fontWeight="500"
          >
            {cm}
          </text>
        )}
      </g>
    )
  }

  return (
    <div
      ref={rulerRef}
      className="absolute z-30"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
    >
      {/* Badge */}
      <div
        className="flex items-center gap-2 mb-0"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="flex items-center gap-2 bg-[#6b7c5e] text-white px-3 py-1.5 rounded-full shadow-md text-[11px] font-bold tracking-wide select-none">
          <span>📎</span>
          <span>{RULER_LENGTH_CM}CM METRIC STICK</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="w-6 h-6 bg-[#6b7c5e] text-white rounded-full flex items-center justify-center hover:bg-[#5a6b4e] transition-colors cursor-pointer shadow-md text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Ruler body */}
      <div
        className="mt-1 rounded-sm overflow-hidden shadow-lg"
        style={{ width: totalWidth + 2 }}
      >
        <svg
          width={totalWidth + 2}
          height={42}
          viewBox={`-1 -1 ${totalWidth + 2} 42`}
          style={{ display: 'block' }}
        >
          {/* Background */}
          <rect x={0} y={0} width={totalWidth} height={40} fill="#f5f0e8" rx={2} />
          {/* Border */}
          <rect x={0} y={0} width={totalWidth} height={40} fill="none" stroke="#c9c0b0" strokeWidth={1} rx={2} />
          {/* Ticks and labels */}
          {ticks}
        </svg>
      </div>
    </div>
  )
}
