// Portrait orientation layout options
// All frames use portrait (tall rectangle) dimensions
// Thumbnails use width + height percentages, canvas uses same
// Portrait ratio is roughly 2:3 (width:height)

const P = "13x18" // placeholder portrait size

export const portraitLayoutOptions = [
  // ===== 1 PRINT =====
  {
    id: "pt-1",
    name: "Single Portrait",
    frameCount: 1,
    frames: [
      { width: "12%", height: "36%", size: P, top: "26%", left: "44%" },
    ]
  },

  // ===== 2 PRINTS =====
  {
    id: "pt-2a",
    name: "Portrait Stack",
    frameCount: 2,
    frames: [
      { width: "10%", height: "30%", size: P, top: "6%", left: "45%" },
      { width: "10%", height: "30%", size: P, top: "42%", left: "45%" },
    ]
  },
  {
    id: "pt-2b",
    name: "Symmetry Duo",
    frameCount: 2,
    frames: [
      { width: "10%", height: "30%", size: P, top: "28%", left: "36%" },
      { width: "10%", height: "30%", size: P, top: "28%", left: "54%" },
    ]
  },
  {
    id: "pt-2c",
    name: "Staggered Duo",
    frameCount: 2,
    frames: [
      { width: "10%", height: "30%", size: P, top: "16%", left: "36%" },
      { width: "10%", height: "30%", size: P, top: "38%", left: "54%" },
    ]
  },

  // ===== 3 PRINTS =====
  {
    id: "pt-3a",
    name: "Classic Triptych",
    frameCount: 3,
    frames: [
      { width: "9%", height: "27%", size: P, top: "30%", left: "30%" },
      { width: "9%", height: "27%", size: P, top: "30%", left: "45.5%" },
      { width: "9%", height: "27%", size: P, top: "30%", left: "61%" },
    ]
  },
  {
    id: "pt-3b",
    name: "Vertical Stack",
    frameCount: 3,
    frames: [
      { width: "9%", height: "24%", size: P, top: "4%", left: "45.5%" },
      { width: "9%", height: "24%", size: P, top: "32%", left: "45.5%" },
      { width: "9%", height: "24%", size: P, top: "60%", left: "45.5%" },
    ]
  },
  {
    id: "pt-3c",
    name: "Triangle / Pyramid",
    frameCount: 3,
    frames: [
      { width: "9%", height: "27%", size: P, top: "8%", left: "45.5%" },
      { width: "9%", height: "27%", size: P, top: "44%", left: "34%" },
      { width: "9%", height: "27%", size: P, top: "44%", left: "57%" },
    ]
  },
  {
    id: "pt-3d",
    name: "Staggered / Step Layout",
    frameCount: 3,
    frames: [
      { width: "8%", height: "24%", size: P, top: "8%", left: "34%" },
      { width: "8%", height: "24%", size: P, top: "30%", left: "46%" },
      { width: "8%", height: "24%", size: P, top: "52%", left: "58%" },
    ]
  },
  {
    id: "pt-3e",
    name: "Trio Focus",
    frameCount: 3,
    frames: [
      { width: "13%", height: "38%", size: P, top: "16%", left: "34%" },
      { width: "8%", height: "24%", size: P, top: "16%", left: "54%" },
      { width: "8%", height: "24%", size: P, top: "46%", left: "54%" },
    ]
  },

  // ===== 4 PRINTS =====
  {
    id: "pt-4a",
    name: "2×2 Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "28%", size: P, top: "10%", left: "36%" },
      { width: "10%", height: "28%", size: P, top: "10%", left: "54%" },
      { width: "10%", height: "28%", size: P, top: "44%", left: "36%" },
      { width: "10%", height: "28%", size: P, top: "44%", left: "54%" },
    ]
  },
  {
    id: "pt-4b",
    name: "1×4 Horizontal Row",
    frameCount: 4,
    frames: [
      { width: "8%", height: "24%", size: P, top: "32%", left: "23%" },
      { width: "8%", height: "24%", size: P, top: "32%", left: "37%" },
      { width: "8%", height: "24%", size: P, top: "32%", left: "51%" },
      { width: "8%", height: "24%", size: P, top: "32%", left: "65%" },
    ]
  },
  {
    id: "pt-4c",
    name: "Vertical Column",
    frameCount: 4,
    frames: [
      { width: "8%", height: "20%", size: P, top: "2%", left: "46%" },
      { width: "8%", height: "20%", size: P, top: "25%", left: "46%" },
      { width: "8%", height: "20%", size: P, top: "48%", left: "46%" },
      { width: "8%", height: "20%", size: P, top: "71%", left: "46%" },
    ]
  },
  {
    id: "pt-4d",
    name: "Two Vertical Stacks Side-by-Side",
    frameCount: 4,
    frames: [
      { width: "9%", height: "24%", size: P, top: "10%", left: "36%" },
      { width: "9%", height: "24%", size: P, top: "40%", left: "36%" },
      { width: "9%", height: "24%", size: P, top: "10%", left: "55%" },
      { width: "9%", height: "24%", size: P, top: "40%", left: "55%" },
    ]
  },
  {
    id: "pt-4e",
    name: "Staggered / Step Layout",
    frameCount: 4,
    frames: [
      { width: "7%", height: "21%", size: P, top: "6%", left: "30%" },
      { width: "7%", height: "21%", size: P, top: "24%", left: "42%" },
      { width: "7%", height: "21%", size: P, top: "42%", left: "54%" },
      { width: "7%", height: "21%", size: P, top: "60%", left: "66%" },
    ]
  },
  {
    id: "pt-4f",
    name: "Portrait Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "26%", size: P, top: "12%", left: "34%" },
      { width: "10%", height: "26%", size: P, top: "12%", left: "50%" },
      { width: "10%", height: "26%", size: P, top: "46%", left: "34%" },
      { width: "10%", height: "26%", size: P, top: "46%", left: "50%" },
    ]
  },

  // ===== 5 PRINTS =====
  {
    id: "pt-5a",
    name: "1×5 Horizontal Row",
    frameCount: 5,
    frames: [
      { width: "7%", height: "21%", size: P, top: "34%", left: "19%" },
      { width: "7%", height: "21%", size: P, top: "34%", left: "31%" },
      { width: "7%", height: "21%", size: P, top: "34%", left: "43%" },
      { width: "7%", height: "21%", size: P, top: "34%", left: "55%" },
      { width: "7%", height: "21%", size: P, top: "34%", left: "67%" },
    ]
  },
  {
    id: "pt-5b",
    name: "Vertical Column",
    frameCount: 5,
    frames: [
      { width: "7%", height: "16%", size: P, top: "2%", left: "46.5%" },
      { width: "7%", height: "16%", size: P, top: "20%", left: "46.5%" },
      { width: "7%", height: "16%", size: P, top: "38%", left: "46.5%" },
      { width: "7%", height: "16%", size: P, top: "56%", left: "46.5%" },
      { width: "7%", height: "16%", size: P, top: "74%", left: "46.5%" },
    ]
  },
  {
    id: "pt-5c",
    name: "3 Over 2",
    frameCount: 5,
    frames: [
      { width: "8%", height: "24%", size: P, top: "8%", left: "30%" },
      { width: "8%", height: "24%", size: P, top: "8%", left: "46%" },
      { width: "8%", height: "24%", size: P, top: "8%", left: "62%" },
      { width: "8%", height: "24%", size: P, top: "40%", left: "38%" },
      { width: "8%", height: "24%", size: P, top: "40%", left: "54%" },
    ]
  },
  {
    id: "pt-5d",
    name: "2 Over 3",
    frameCount: 5,
    frames: [
      { width: "8%", height: "24%", size: P, top: "8%", left: "38%" },
      { width: "8%", height: "24%", size: P, top: "8%", left: "54%" },
      { width: "8%", height: "24%", size: P, top: "40%", left: "30%" },
      { width: "8%", height: "24%", size: P, top: "40%", left: "46%" },
      { width: "8%", height: "24%", size: P, top: "40%", left: "62%" },
    ]
  },
  {
    id: "pt-5e",
    name: "Cross / Plus",
    frameCount: 5,
    frames: [
      { width: "7%", height: "21%", size: P, top: "6%", left: "46.5%" },
      { width: "7%", height: "21%", size: P, top: "32%", left: "33%" },
      { width: "7%", height: "21%", size: P, top: "32%", left: "46.5%" },
      { width: "7%", height: "21%", size: P, top: "32%", left: "60%" },
      { width: "7%", height: "21%", size: P, top: "58%", left: "46.5%" },
    ]
  },
  {
    id: "pt-5f",
    name: "Diagonal / Step",
    frameCount: 5,
    frames: [
      { width: "6%", height: "18%", size: P, top: "4%", left: "28%" },
      { width: "6%", height: "18%", size: P, top: "20%", left: "38%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "48%" },
      { width: "6%", height: "18%", size: P, top: "52%", left: "58%" },
      { width: "6%", height: "18%", size: P, top: "68%", left: "68%" },
    ]
  },

  // ===== 6+ PRINTS =====
  {
    id: "pt-6a",
    name: "2×3 Grid",
    frameCount: 6,
    frames: [
      { width: "8%", height: "24%", size: P, top: "16%", left: "28%" },
      { width: "8%", height: "24%", size: P, top: "16%", left: "46%" },
      { width: "8%", height: "24%", size: P, top: "16%", left: "64%" },
      { width: "8%", height: "24%", size: P, top: "46%", left: "28%" },
      { width: "8%", height: "24%", size: P, top: "46%", left: "46%" },
      { width: "8%", height: "24%", size: P, top: "46%", left: "64%" },
    ]
  },
  {
    id: "pt-6b",
    name: "3×2 Grid",
    frameCount: 6,
    frames: [
      { width: "9%", height: "22%", size: P, top: "4%", left: "38%" },
      { width: "9%", height: "22%", size: P, top: "4%", left: "55%" },
      { width: "9%", height: "22%", size: P, top: "30%", left: "38%" },
      { width: "9%", height: "22%", size: P, top: "30%", left: "55%" },
      { width: "9%", height: "22%", size: P, top: "56%", left: "38%" },
      { width: "9%", height: "22%", size: P, top: "56%", left: "55%" },
    ]
  },
  {
    id: "pt-6c",
    name: "1×6 Horizontal Row",
    frameCount: 6,
    frames: [
      { width: "6%", height: "18%", size: P, top: "36%", left: "14%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "25%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "36%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "47%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "58%" },
      { width: "6%", height: "18%", size: P, top: "36%", left: "69%" },
    ]
  },
  {
    id: "pt-6d",
    name: "Paired Triptychs",
    frameCount: 6,
    frames: [
      // Top row - 3
      { width: "7%", height: "21%", size: P, top: "10%", left: "30%" },
      { width: "7%", height: "21%", size: P, top: "10%", left: "46.5%" },
      { width: "7%", height: "21%", size: P, top: "10%", left: "63%" },
      // Bottom row - 3
      { width: "7%", height: "21%", size: P, top: "40%", left: "30%" },
      { width: "7%", height: "21%", size: P, top: "40%", left: "46.5%" },
      { width: "7%", height: "21%", size: P, top: "40%", left: "63%" },
    ]
  },
  {
    id: "pt-6e",
    name: "Stair-Step Diagonal",
    frameCount: 6,
    frames: [
      { width: "6%", height: "18%", size: P, top: "2%", left: "26%" },
      { width: "6%", height: "18%", size: P, top: "16%", left: "36%" },
      { width: "6%", height: "18%", size: P, top: "30%", left: "46%" },
      { width: "6%", height: "18%", size: P, top: "44%", left: "56%" },
      { width: "6%", height: "18%", size: P, top: "58%", left: "66%" },
      { width: "6%", height: "18%", size: P, top: "72%", left: "76%" },
    ]
  },
  {
    id: "pt-6f",
    name: "4 + 2 Offset Block",
    frameCount: 6,
    frames: [
      // Top row - 4
      { width: "7%", height: "21%", size: P, top: "10%", left: "24%" },
      { width: "7%", height: "21%", size: P, top: "10%", left: "39%" },
      { width: "7%", height: "21%", size: P, top: "10%", left: "54%" },
      { width: "7%", height: "21%", size: P, top: "10%", left: "69%" },
      // Bottom row - 2 centered
      { width: "7%", height: "21%", size: P, top: "40%", left: "39%" },
      { width: "7%", height: "21%", size: P, top: "40%", left: "54%" },
    ]
  },
  {
    id: "pt-6g",
    name: "Studio Grid",
    frameCount: 8,
    frames: [
      // 4 rows × 2 cols
      { width: "8%", height: "20%", size: P, top: "2%", left: "38%" },
      { width: "8%", height: "20%", size: P, top: "2%", left: "54%" },
      { width: "8%", height: "20%", size: P, top: "26%", left: "38%" },
      { width: "8%", height: "20%", size: P, top: "26%", left: "54%" },
      { width: "8%", height: "20%", size: P, top: "50%", left: "38%" },
      { width: "8%", height: "20%", size: P, top: "50%", left: "54%" },
      { width: "8%", height: "20%", size: P, top: "74%", left: "38%" },
      { width: "8%", height: "20%", size: P, top: "74%", left: "54%" },
    ]
  },
]
