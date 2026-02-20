import { useState, useRef, useCallback, useEffect } from 'react'

const RULER_LENGTH_CM = 190
const PX_PER_CM = 3.0        // compact — 190 cm ≈ 570 px
const RULER_H   = 38         // taller / thicker body
const RX        = 5          // rounded corners

// 28×28 four-way arrow — all tips fully inside the viewBox
const ARROW_SVG = `%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cpolygon points='14,2 18,8 16,8 16,12 20,12 20,10 26,14 20,18 20,16 16,16 16,20 18,20 14,26 10,20 12,20 12,16 8,16 8,18 2,14 8,10 8,12 12,12 12,8 10,8' fill='white' stroke='%23333' stroke-width='1'/%3E%3C/svg%3E`

export default function Ruler({ onClose }) {
  const [position, setPosition] = useState({ x: 40, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const startDrag = useCallback((e) => {
    if (e.target.closest('button')) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragStart.current = { x: clientX - position.x, y: clientY - position.y }
  }, [position])

  const onMove = useCallback((e) => {
    if (!isDragging) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    setPosition({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    })
  }, [isDragging])

  const onUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove, { passive: false })
      window.addEventListener('touchend', onUp)
    }
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [isDragging, onMove, onUp])

  const totalWidth = RULER_LENGTH_CM * PX_PER_CM

  // Ticks from BOTH top-edge (down) and bottom-edge (up) — real ruler style
  const ticks = []
  for (let cm = 0; cm <= RULER_LENGTH_CM; cm++) {
    const isMajor = cm % 10 === 0
    const isMid   = cm % 5  === 0 && !isMajor
    const x       = cm * PX_PER_CM
    const sw      = isMajor ? 0.9 : 0.55
    const col     = isMajor ? '#444' : '#777'

    // top tick (downward from y=0)
    const topH = isMajor ? RULER_H * 0.60 : isMid ? RULER_H * 0.37 : RULER_H * 0.20

    ticks.push(
      <g key={cm}>
        <line x1={x} y1={0} x2={x} y2={topH} stroke={col} strokeWidth={sw} />
        {isMajor && cm > 0 && (
          <text
            x={x} y={RULER_H - 4}
            textAnchor="middle"
            fontSize="6.5"
            fontFamily="Arial, sans-serif"
            fill="#333"
            fontWeight="600"
          >
            {cm}
          </text>
        )}
      </g>
    )
  }

  const moveCursor  = `url("data:image/svg+xml,${ARROW_SVG}") 14 14, move`
  const grabCursor  = `url("data:image/svg+xml,${ARROW_SVG}") 14 14, grabbing`
  const cursor      = isDragging ? grabCursor : moveCursor

  return (
    <div className="absolute z-30 select-none" style={{ left: position.x, top: position.y }}>

      {/* Badge row */}
      <div
        className="flex items-center gap-1.5 mb-1"
        style={{ cursor }}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className="flex items-center gap-1.5 bg-[#5a6e4a] text-white px-2.5 py-1 rounded-full shadow text-[10px] font-bold tracking-wide">
          <svg className="w-2.5 h-2.5 opacity-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
          </svg>
          <span>{RULER_LENGTH_CM}CM METRIC STICK</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-5 h-5 bg-white/90 text-gray-600 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow text-[10px] font-bold leading-none"
          style={{ cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {/* Ruler bar */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{ cursor, width: totalWidth + 2 }}
        className="overflow-hidden shadow-md"
        // rounded via SVG rx so the clip matches perfectly
      >
        <svg
          width={totalWidth + 2}
          height={RULER_H + 2}
          viewBox={`-1 -1 ${totalWidth + 2} ${RULER_H + 2}`}
          style={{ display: 'block' }}
        >
          {/* Body */}
          <rect x={0} y={0} width={totalWidth} height={RULER_H} fill="#f8f6f0" rx={RX} />
          {/* Border */}
          <rect x={0} y={0} width={totalWidth} height={RULER_H} fill="none" stroke="#bdb5a4" strokeWidth={0.9} rx={RX} />
          {/* Clip ticks to rounded rect */}
          <clipPath id="rulerClip">
            <rect x={0} y={0} width={totalWidth} height={RULER_H} rx={RX} />
          </clipPath>
          <g clipPath="url(#rulerClip)">{ticks}</g>
        </svg>
      </div>

    </div>
  )
}