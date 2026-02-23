// Square orientation layout options
// All frames use square dimensions
// Thumbnails use width + aspect-ratio:1, canvas uses width + height
// Size will be dynamically set based on printSize selection

const S = "35x35" // placeholder square size

export const squareLayoutOptions = [
  // ===== 1 PRINT =====
  {
    id: "sq-1",
    name: "Square Solo",
    frameCount: 1,
    frames: [
      { width: "16%", height: "32%", size: S, top: "28%", left: "42%" },
    ]
  },

  // ===== 2 PRINTS =====
  {
    id: "sq-2a",
    name: "1 × 2",
    frameCount: 2,
    frames: [
      { width: "14%", height: "28%", size: S, top: "30%", left: "34%" },
      { width: "14%", height: "28%", size: S, top: "30%", left: "52%" },
    ]
  },
  {
    id: "sq-2b",
    name: "2 × 1",
    frameCount: 2,
    frames: [
      { width: "14%", height: "28%", size: S, top: "14%", left: "43%" },
      { width: "14%", height: "28%", size: S, top: "48%", left: "43%" },
    ]
  },

  // ===== 3 PRINTS =====
  {
    id: "sq-3a",
    name: "1 × 3 Horizontal Row",
    frameCount: 3,
    frames: [
      { width: "12%", height: "24%", size: S, top: "32%", left: "28%" },
      { width: "12%", height: "24%", size: S, top: "32%", left: "44%" },
      { width: "12%", height: "24%", size: S, top: "32%", left: "60%" },
    ]
  },
  {
    id: "sq-3b",
    name: "3 × 1 Vertical Stack",
    frameCount: 3,
    frames: [
      { width: "12%", height: "24%", size: S, top: "6%", left: "44%" },
      { width: "12%", height: "24%", size: S, top: "34%", left: "44%" },
      { width: "12%", height: "24%", size: S, top: "62%", left: "44%" },
    ]
  },

  // ===== 4 PRINTS =====
  {
    id: "sq-4a",
    name: "2 × 2 Grid",
    frameCount: 4,
    frames: [
      { width: "12%", height: "24%", size: S, top: "16%", left: "36%" },
      { width: "12%", height: "24%", size: S, top: "16%", left: "52%" },
      { width: "12%", height: "24%", size: S, top: "46%", left: "36%" },
      { width: "12%", height: "24%", size: S, top: "46%", left: "52%" },
    ]
  },
  {
    id: "sq-4b",
    name: "1 × 4 Horizontal Row",
    frameCount: 4,
    frames: [
      { width: "10%", height: "20%", size: S, top: "34%", left: "22%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "36%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "50%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "64%" },
    ]
  },
  {
    id: "sq-4c",
    name: "Stair Step",
    frameCount: 4,
    frames: [
      { width: "10%", height: "20%", size: S, top: "10%", left: "30%" },
      { width: "10%", height: "20%", size: S, top: "28%", left: "42%" },
      { width: "10%", height: "20%", size: S, top: "46%", left: "54%" },
      { width: "10%", height: "20%", size: S, top: "64%", left: "66%" },
    ]
  },

  // ===== 5 PRINTS =====
  {
    id: "sq-5a",
    name: "Centered Diamond",
    frameCount: 5,
    frames: [
      { width: "10%", height: "20%", size: S, top: "8%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "32%", left: "32%" },
      { width: "10%", height: "20%", size: S, top: "32%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "32%", left: "58%" },
      { width: "10%", height: "20%", size: S, top: "56%", left: "45%" },
    ]
  },
  {
    id: "sq-5b",
    name: "Plus Grid (5)",
    frameCount: 5,
    frames: [
      { width: "10%", height: "20%", size: S, top: "10%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "32%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "58%" },
      { width: "10%", height: "20%", size: S, top: "58%", left: "45%" },
    ]
  },

  // ===== 6+ PRINTS =====
  {
    id: "sq-6a",
    name: "3 × 3 Grid",
    frameCount: 9,
    frames: [
      { width: "9%", height: "18%", size: S, top: "8%", left: "32%" },
      { width: "9%", height: "18%", size: S, top: "8%", left: "45.5%" },
      { width: "9%", height: "18%", size: S, top: "8%", left: "59%" },
      { width: "9%", height: "18%", size: S, top: "30%", left: "32%" },
      { width: "9%", height: "18%", size: S, top: "30%", left: "45.5%" },
      { width: "9%", height: "18%", size: S, top: "30%", left: "59%" },
      { width: "9%", height: "18%", size: S, top: "52%", left: "32%" },
      { width: "9%", height: "18%", size: S, top: "52%", left: "45.5%" },
      { width: "9%", height: "18%", size: S, top: "52%", left: "59%" },
    ]
  },
  {
    id: "sq-6b",
    name: "3 × 2 Grid",
    frameCount: 6,
    frames: [
      { width: "10%", height: "20%", size: S, top: "8%", left: "36%" },
      { width: "10%", height: "20%", size: S, top: "8%", left: "54%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "36%" },
      { width: "10%", height: "20%", size: S, top: "34%", left: "54%" },
      { width: "10%", height: "20%", size: S, top: "60%", left: "36%" },
      { width: "10%", height: "20%", size: S, top: "60%", left: "54%" },
    ]
  },
  {
    id: "sq-6c",
    name: "2 × 3 Grid",
    frameCount: 6,
    frames: [
      { width: "10%", height: "20%", size: S, top: "22%", left: "26%" },
      { width: "10%", height: "20%", size: S, top: "22%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "22%", left: "64%" },
      { width: "10%", height: "20%", size: S, top: "48%", left: "26%" },
      { width: "10%", height: "20%", size: S, top: "48%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "48%", left: "64%" },
    ]
  },
  {
    id: "sq-6d",
    name: "4 × 4 Grid",
    frameCount: 16,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "7%", height: "14%", size: S, top: `${8 + r * 20}%`, left: `${28 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6e",
    name: "Offset Grid",
    frameCount: 6,
    frames: [
      { width: "10%", height: "20%", size: S, top: "12%", left: "32%" },
      { width: "10%", height: "20%", size: S, top: "12%", left: "50%" },
      { width: "10%", height: "20%", size: S, top: "38%", left: "41%" },
      { width: "10%", height: "20%", size: S, top: "38%", left: "59%" },
      { width: "10%", height: "20%", size: S, top: "64%", left: "32%" },
      { width: "10%", height: "20%", size: S, top: "64%", left: "50%" },
    ]
  },
  {
    id: "sq-6f",
    name: "2 × 4 Grid (Wide Eight)",
    frameCount: 8,
    frames: (() => {
      const f = []
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "8%", height: "16%", size: S, top: `${24 + r * 22}%`, left: `${26 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6g",
    name: "4 × 2 Grid (Tall Eight)",
    frameCount: 8,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          f.push({ width: "10%", height: "20%", size: S, top: `${4 + r * 24}%`, left: `${38 + c * 16}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6h",
    name: "4 × 3 Grid",
    frameCount: 12,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          f.push({ width: "8%", height: "16%", size: S, top: `${6 + r * 22}%`, left: `${33 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6i",
    name: "3 × 4 Grid",
    frameCount: 12,
    frames: (() => {
      const f = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "8%", height: "16%", size: S, top: `${14 + r * 22}%`, left: `${26 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6j",
    name: "5 × 2 Grid",
    frameCount: 10,
    frames: (() => {
      const f = []
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 2; c++) {
          f.push({ width: "9%", height: "16%", size: S, top: `${4 + r * 18}%`, left: `${38 + c * 16}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6k",
    name: "2 × 5 Grid",
    frameCount: 10,
    frames: (() => {
      const f = []
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
          f.push({ width: "7%", height: "14%", size: S, top: `${26 + r * 20}%`, left: `${24 + c * 12}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "sq-6l",
    name: "Staggered Brick",
    frameCount: 7,
    frames: [
      // Row 1 - 3 squares
      { width: "9%", height: "18%", size: S, top: "10%", left: "30%" },
      { width: "9%", height: "18%", size: S, top: "10%", left: "45.5%" },
      { width: "9%", height: "18%", size: S, top: "10%", left: "61%" },
      // Row 2 - 2 squares offset
      { width: "9%", height: "18%", size: S, top: "34%", left: "37.5%" },
      { width: "9%", height: "18%", size: S, top: "34%", left: "53%" },
      // Row 3 - 2 squares
      { width: "9%", height: "18%", size: S, top: "58%", left: "30%" },
      { width: "9%", height: "18%", size: S, top: "58%", left: "61%" },
    ]
  },
  {
    id: "sq-6m",
    name: "Pyramid",
    frameCount: 6,
    frames: [
      // Row 1 - 1
      { width: "10%", height: "20%", size: S, top: "6%", left: "45%" },
      // Row 2 - 2
      { width: "10%", height: "20%", size: S, top: "32%", left: "36%" },
      { width: "10%", height: "20%", size: S, top: "32%", left: "54%" },
      // Row 3 - 3
      { width: "10%", height: "20%", size: S, top: "58%", left: "27%" },
      { width: "10%", height: "20%", size: S, top: "58%", left: "45%" },
      { width: "10%", height: "20%", size: S, top: "58%", left: "63%" },
    ]
  },
]
