// Landscape orientation layout options
// All frames use landscape (wide rectangle) dimensions — width > height
// Landscape ratio is roughly 4:3 (width:height)

const L = "40x30" // placeholder landscape size

export const landscapeLayoutOptions = [
  // ===== 1 PRINT =====
  {
    id: "ls-1a",
    name: "Single Landscape",
    frameCount: 1,
    frames: [
      { width: "24%", height: "16%", size: L, top: "36%", left: "38%" },
    ]
  },

  // ===== 2 PRINTS =====
  {
    id: "ls-2a",
    name: "1 × 2 Landscape Pair",
    frameCount: 2,
    frames: [
      { width: "20%", height: "14%", size: L, top: "36%", left: "26%" },
      { width: "20%", height: "14%", size: L, top: "36%", left: "54%" },
    ]
  },
  {
    id: "ls-2b",
    name: "2 × 1 Landscape Stack",
    frameCount: 2,
    frames: [
      { width: "22%", height: "14%", size: L, top: "18%", left: "39%" },
      { width: "22%", height: "14%", size: L, top: "46%", left: "39%" },
    ]
  },

  // ===== 3 PRINTS =====
  {
    id: "ls-3a",
    name: "1 × 3 Landscape Row",
    frameCount: 3,
    frames: [
      { width: "16%", height: "11%", size: L, top: "38%", left: "18%" },
      { width: "16%", height: "11%", size: L, top: "38%", left: "42%" },
      { width: "16%", height: "11%", size: L, top: "38%", left: "66%" },
    ]
  },
  {
    id: "ls-3b",
    name: "3 × 1 Landscape Stack",
    frameCount: 3,
    frames: [
      { width: "22%", height: "12%", size: L, top: "10%", left: "39%" },
      { width: "22%", height: "12%", size: L, top: "34%", left: "39%" },
      { width: "22%", height: "12%", size: L, top: "58%", left: "39%" },
    ]
  },

  // ===== 4 PRINTS =====
  {
    id: "ls-4a",
    name: "2 × 2 Landscape Grid",
    frameCount: 4,
    frames: [
      { width: "18%", height: "12%", size: L, top: "18%", left: "28%" },
      { width: "18%", height: "12%", size: L, top: "18%", left: "54%" },
      { width: "18%", height: "12%", size: L, top: "44%", left: "28%" },
      { width: "18%", height: "12%", size: L, top: "44%", left: "54%" },
    ]
  },

  // ===== 5 PRINTS — intentionally empty =====
  // ===== 6+ PRINTS — intentionally empty =====
]
