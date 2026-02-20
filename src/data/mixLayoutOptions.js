// Mix orientation layout options
// Combines portrait, landscape and square frames in varied arrangements
// Thumbnails rendered from frame positions, canvas uses same positions

const M = "13x18" // placeholder mix size — overridden by printSize selection

export const mixLayoutOptions = [
  // =====================================================================
  // ===== 1 PRINT =====
  // =====================================================================
  {
    id: "mx-1a",
    name: "Single Portrait",
    frameCount: 1,
    frames: [
      { width: "10%", height: "30%", size: M, top: "28%", left: "45%" },
    ]
  },
  {
    id: "mx-1b",
    name: "Single Landscape",
    frameCount: 1,
    frames: [
      { width: "16%", height: "20%", size: M, top: "34%", left: "42%" },
    ]
  },
  {
    id: "mx-1c",
    name: "Square Solo",
    frameCount: 1,
    frames: [
      { width: "14%", height: "28%", size: M, top: "30%", left: "43%" },
    ]
  },
  {
    id: "mx-1d",
    name: "Custom Arrangement",
    frameCount: 1,
    frames: [
      { width: "12%", height: "24%", size: M, top: "32%", left: "44%" },
    ]
  },

  // =====================================================================
  // ===== 2 PRINTS =====
  // =====================================================================
  {
    id: "mx-2a",
    name: "Portrait Stack",
    frameCount: 2,
    frames: [
      { width: "9%", height: "27%", size: M, top: "8%", left: "45.5%" },
      { width: "9%", height: "27%", size: M, top: "42%", left: "45.5%" },
    ]
  },
  {
    id: "mx-2b",
    name: "2 × 1",
    frameCount: 2,
    frames: [
      { width: "9%", height: "27%", size: M, top: "30%", left: "36%" },
      { width: "9%", height: "27%", size: M, top: "30%", left: "55%" },
    ]
  },
  {
    id: "mx-2c",
    name: "1 × 2",
    frameCount: 2,
    frames: [
      { width: "14%", height: "18%", size: M, top: "16%", left: "43%" },
      { width: "14%", height: "18%", size: M, top: "42%", left: "43%" },
    ]
  },
  {
    id: "mx-2d",
    name: "Symmetry Duo",
    frameCount: 2,
    frames: [
      { width: "9%", height: "27%", size: M, top: "28%", left: "36%" },
      { width: "9%", height: "27%", size: M, top: "28%", left: "55%" },
    ]
  },
  {
    id: "mx-2e",
    name: "Staggered Duo",
    frameCount: 2,
    frames: [
      { width: "9%", height: "27%", size: M, top: "14%", left: "36%" },
      { width: "9%", height: "27%", size: M, top: "38%", left: "55%" },
    ]
  },
  {
    id: "mx-2f",
    name: "2 × 1 Landscape Pair",
    frameCount: 2,
    frames: [
      { width: "16%", height: "20%", size: M, top: "34%", left: "28%" },
      { width: "16%", height: "20%", size: M, top: "34%", left: "56%" },
    ]
  },
  {
    id: "mx-2g",
    name: "1 × 2 Landscape Stack",
    frameCount: 2,
    frames: [
      { width: "16%", height: "20%", size: M, top: "14%", left: "42%" },
      { width: "16%", height: "20%", size: M, top: "42%", left: "42%" },
    ]
  },
  {
    id: "mx-2h",
    name: "Perfect Pair",
    frameCount: 2,
    frames: [
      { width: "10%", height: "30%", size: M, top: "28%", left: "38%" },
      { width: "10%", height: "30%", size: M, top: "28%", left: "52%" },
    ]
  },

  // =====================================================================
  // ===== 3 PRINTS =====
  // =====================================================================
  {
    id: "mx-3a",
    name: "Classic Triptych",
    frameCount: 3,
    frames: [
      { width: "9%", height: "27%", size: M, top: "30%", left: "30%" },
      { width: "9%", height: "27%", size: M, top: "30%", left: "45.5%" },
      { width: "9%", height: "27%", size: M, top: "30%", left: "61%" },
    ]
  },
  {
    id: "mx-3b",
    name: "Vertical Stack",
    frameCount: 3,
    frames: [
      { width: "9%", height: "24%", size: M, top: "4%", left: "45.5%" },
      { width: "9%", height: "24%", size: M, top: "32%", left: "45.5%" },
      { width: "9%", height: "24%", size: M, top: "60%", left: "45.5%" },
    ]
  },
  {
    id: "mx-3c",
    name: "Triangle / Pyramid",
    frameCount: 3,
    frames: [
      { width: "9%", height: "27%", size: M, top: "8%", left: "45.5%" },
      { width: "9%", height: "27%", size: M, top: "44%", left: "34%" },
      { width: "9%", height: "27%", size: M, top: "44%", left: "57%" },
    ]
  },
  {
    id: "mx-3d",
    name: "Staggered / Step Layout",
    frameCount: 3,
    frames: [
      { width: "8%", height: "24%", size: M, top: "8%", left: "34%" },
      { width: "8%", height: "24%", size: M, top: "30%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "52%", left: "58%" },
    ]
  },
  {
    id: "mx-3e",
    name: "1 × 3 Horizontal Row",
    frameCount: 3,
    frames: [
      { width: "14%", height: "18%", size: M, top: "34%", left: "20%" },
      { width: "14%", height: "18%", size: M, top: "34%", left: "43%" },
      { width: "14%", height: "18%", size: M, top: "34%", left: "66%" },
    ]
  },
  {
    id: "mx-3f",
    name: "1 × 3 Vertical Stack",
    frameCount: 3,
    frames: [
      { width: "9%", height: "24%", size: M, top: "4%", left: "45.5%" },
      { width: "9%", height: "24%", size: M, top: "32%", left: "45.5%" },
      { width: "9%", height: "24%", size: M, top: "60%", left: "45.5%" },
    ]
  },
  {
    id: "mx-3g",
    name: "Trio Focus",
    frameCount: 3,
    frames: [
      { width: "13%", height: "38%", size: M, top: "16%", left: "34%" },
      { width: "8%", height: "24%", size: M, top: "16%", left: "54%" },
      { width: "8%", height: "24%", size: M, top: "46%", left: "54%" },
    ]
  },
  {
    id: "mx-3h",
    name: "Eclectic Mix",
    frameCount: 3,
    frames: [
      { width: "12%", height: "16%", size: M, top: "34%", left: "30%" },
      { width: "9%", height: "27%", size: M, top: "26%", left: "48%" },
      { width: "10%", height: "14%", size: M, top: "40%", left: "62%" },
    ]
  },
  {
    id: "mx-3i",
    name: "Anchored Symmetry",
    frameCount: 3,
    frames: [
      { width: "12%", height: "36%", size: M, top: "18%", left: "38%" },
      { width: "8%", height: "20%", size: M, top: "18%", left: "55%" },
      { width: "8%", height: "20%", size: M, top: "44%", left: "55%" },
    ]
  },
  {
    id: "mx-3j",
    name: "Staircase Sweep",
    frameCount: 3,
    frames: [
      { width: "9%", height: "18%", size: M, top: "12%", left: "36%" },
      { width: "9%", height: "18%", size: M, top: "30%", left: "46%" },
      { width: "9%", height: "18%", size: M, top: "48%", left: "56%" },
    ]
  },
  {
    id: "mx-3k",
    name: "3 × 1 Landscape Row",
    frameCount: 3,
    frames: [
      { width: "14%", height: "18%", size: M, top: "34%", left: "20%" },
      { width: "14%", height: "18%", size: M, top: "34%", left: "43%" },
      { width: "14%", height: "18%", size: M, top: "34%", left: "66%" },
    ]
  },
  {
    id: "mx-3l",
    name: "1 × 3 Landscape Stack",
    frameCount: 3,
    frames: [
      { width: "16%", height: "18%", size: M, top: "8%", left: "42%" },
      { width: "16%", height: "18%", size: M, top: "32%", left: "42%" },
      { width: "16%", height: "18%", size: M, top: "56%", left: "42%" },
    ]
  },
  {
    id: "mx-3m",
    name: "Classic Trio",
    frameCount: 3,
    frames: [
      { width: "10%", height: "30%", size: M, top: "28%", left: "30%" },
      { width: "10%", height: "30%", size: M, top: "28%", left: "45%" },
      { width: "10%", height: "30%", size: M, top: "28%", left: "60%" },
    ]
  },

  // =====================================================================
  // ===== 4 PRINTS =====
  // =====================================================================
  {
    id: "mx-4a",
    name: "2×2 Grid",
    frameCount: 4,
    frames: [
      { width: "9%", height: "27%", size: M, top: "10%", left: "36%" },
      { width: "9%", height: "27%", size: M, top: "10%", left: "55%" },
      { width: "9%", height: "27%", size: M, top: "44%", left: "36%" },
      { width: "9%", height: "27%", size: M, top: "44%", left: "55%" },
    ]
  },
  {
    id: "mx-4b",
    name: "1×4 Horizontal Row",
    frameCount: 4,
    frames: [
      { width: "8%", height: "10%", size: M, top: "40%", left: "22%" },
      { width: "8%", height: "10%", size: M, top: "40%", left: "37%" },
      { width: "8%", height: "10%", size: M, top: "40%", left: "52%" },
      { width: "8%", height: "10%", size: M, top: "40%", left: "67%" },
    ]
  },
  {
    id: "mx-4c",
    name: "2×2 Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "20%", size: M, top: "14%", left: "36%" },
      { width: "10%", height: "20%", size: M, top: "14%", left: "54%" },
      { width: "10%", height: "20%", size: M, top: "42%", left: "36%" },
      { width: "10%", height: "20%", size: M, top: "42%", left: "54%" },
    ]
  },
  {
    id: "mx-4d",
    name: "Vertical Column",
    frameCount: 4,
    frames: [
      { width: "8%", height: "20%", size: M, top: "2%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "25%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "48%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "71%", left: "46%" },
    ]
  },
  {
    id: "mx-4e",
    name: "Two Vertical Stacks Side-by-Side",
    frameCount: 4,
    frames: [
      { width: "9%", height: "24%", size: M, top: "10%", left: "36%" },
      { width: "9%", height: "24%", size: M, top: "40%", left: "36%" },
      { width: "9%", height: "24%", size: M, top: "10%", left: "55%" },
      { width: "9%", height: "24%", size: M, top: "40%", left: "55%" },
    ]
  },
  {
    id: "mx-4f",
    name: "Staggered / Step Layout",
    frameCount: 4,
    frames: [
      { width: "7%", height: "21%", size: M, top: "6%", left: "30%" },
      { width: "7%", height: "21%", size: M, top: "24%", left: "42%" },
      { width: "7%", height: "21%", size: M, top: "42%", left: "54%" },
      { width: "7%", height: "21%", size: M, top: "60%", left: "66%" },
    ]
  },
  {
    id: "mx-4g",
    name: "2 × 2 Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "28%", size: M, top: "10%", left: "34%" },
      { width: "10%", height: "28%", size: M, top: "10%", left: "56%" },
      { width: "10%", height: "28%", size: M, top: "46%", left: "34%" },
      { width: "10%", height: "28%", size: M, top: "46%", left: "56%" },
    ]
  },
  {
    id: "mx-4h",
    name: "1 × 4 Horizontal Row",
    frameCount: 4,
    frames: [
      { width: "10%", height: "12%", size: M, top: "38%", left: "18%" },
      { width: "10%", height: "12%", size: M, top: "38%", left: "34%" },
      { width: "10%", height: "12%", size: M, top: "38%", left: "50%" },
      { width: "10%", height: "12%", size: M, top: "38%", left: "66%" },
    ]
  },
  {
    id: "mx-4i",
    name: "Stair Step",
    frameCount: 4,
    frames: [
      { width: "8%", height: "16%", size: M, top: "10%", left: "30%" },
      { width: "8%", height: "16%", size: M, top: "28%", left: "42%" },
      { width: "8%", height: "16%", size: M, top: "46%", left: "54%" },
      { width: "8%", height: "16%", size: M, top: "64%", left: "66%" },
    ]
  },
  {
    id: "mx-4j",
    name: "Portrait Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "28%", size: M, top: "10%", left: "34%" },
      { width: "10%", height: "28%", size: M, top: "10%", left: "56%" },
      { width: "10%", height: "28%", size: M, top: "46%", left: "34%" },
      { width: "10%", height: "28%", size: M, top: "46%", left: "56%" },
    ]
  },
  {
    id: "mx-4k",
    name: "Shelf / Ledger",
    frameCount: 4,
    frames: [
      { width: "12%", height: "14%", size: M, top: "38%", left: "20%" },
      { width: "12%", height: "14%", size: M, top: "38%", left: "36%" },
      { width: "12%", height: "14%", size: M, top: "38%", left: "52%" },
      { width: "12%", height: "14%", size: M, top: "38%", left: "68%" },
    ]
  },
  {
    id: "mx-4l",
    name: "Linear Rows",
    frameCount: 4,
    frames: [
      { width: "8%", height: "10%", size: M, top: "38%", left: "22%" },
      { width: "8%", height: "10%", size: M, top: "38%", left: "36%" },
      { width: "8%", height: "10%", size: M, top: "38%", left: "50%" },
      { width: "8%", height: "10%", size: M, top: "38%", left: "64%" },
    ]
  },
  {
    id: "mx-4m",
    name: "2 × 2 Landscape Grid",
    frameCount: 4,
    frames: [
      { width: "14%", height: "18%", size: M, top: "14%", left: "30%" },
      { width: "14%", height: "18%", size: M, top: "14%", left: "56%" },
      { width: "14%", height: "18%", size: M, top: "42%", left: "30%" },
      { width: "14%", height: "18%", size: M, top: "42%", left: "56%" },
    ]
  },
  {
    id: "mx-4n",
    name: "Simple Grid",
    frameCount: 4,
    frames: [
      { width: "10%", height: "20%", size: M, top: "16%", left: "36%" },
      { width: "10%", height: "20%", size: M, top: "16%", left: "54%" },
      { width: "10%", height: "20%", size: M, top: "44%", left: "36%" },
      { width: "10%", height: "20%", size: M, top: "44%", left: "54%" },
    ]
  },
  {
    id: "mx-4o",
    name: "The Mondrian",
    frameCount: 4,
    frames: [
      { width: "12%", height: "32%", size: M, top: "12%", left: "32%" },
      { width: "10%", height: "14%", size: M, top: "12%", left: "52%" },
      { width: "10%", height: "14%", size: M, top: "32%", left: "52%" },
      { width: "14%", height: "18%", size: M, top: "50%", left: "38%" },
    ]
  },

  // =====================================================================
  // ===== 5 PRINTS =====
  // =====================================================================
  {
    id: "mx-5a",
    name: "1×5 Horizontal Row",
    frameCount: 5,
    frames: [
      { width: "7%", height: "21%", size: M, top: "34%", left: "15%" },
      { width: "7%", height: "21%", size: M, top: "34%", left: "28%" },
      { width: "7%", height: "21%", size: M, top: "34%", left: "41%" },
      { width: "7%", height: "21%", size: M, top: "34%", left: "54%" },
      { width: "7%", height: "21%", size: M, top: "34%", left: "67%" },
    ]
  },
  {
    id: "mx-5b",
    name: "Vertical Column",
    frameCount: 5,
    frames: [
      { width: "7%", height: "16%", size: M, top: "2%", left: "46.5%" },
      { width: "7%", height: "16%", size: M, top: "20%", left: "46.5%" },
      { width: "7%", height: "16%", size: M, top: "38%", left: "46.5%" },
      { width: "7%", height: "16%", size: M, top: "56%", left: "46.5%" },
      { width: "7%", height: "16%", size: M, top: "74%", left: "46.5%" },
    ]
  },
  {
    id: "mx-5c",
    name: "3 Over 2",
    frameCount: 5,
    frames: [
      { width: "8%", height: "24%", size: M, top: "8%", left: "30%" },
      { width: "8%", height: "24%", size: M, top: "8%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "8%", left: "62%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "38%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "54%" },
    ]
  },
  {
    id: "mx-5d",
    name: "2 Over 3",
    frameCount: 5,
    frames: [
      { width: "8%", height: "24%", size: M, top: "8%", left: "38%" },
      { width: "8%", height: "24%", size: M, top: "8%", left: "54%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "30%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "62%" },
    ]
  },
  {
    id: "mx-5e",
    name: "Cross / Plus",
    frameCount: 5,
    frames: [
      { width: "7%", height: "21%", size: M, top: "6%", left: "46.5%" },
      { width: "7%", height: "21%", size: M, top: "32%", left: "33%" },
      { width: "7%", height: "21%", size: M, top: "32%", left: "46.5%" },
      { width: "7%", height: "21%", size: M, top: "32%", left: "60%" },
      { width: "7%", height: "21%", size: M, top: "58%", left: "46.5%" },
    ]
  },
  {
    id: "mx-5f",
    name: "Diagonal / Step",
    frameCount: 5,
    frames: [
      { width: "6%", height: "18%", size: M, top: "4%", left: "28%" },
      { width: "6%", height: "18%", size: M, top: "20%", left: "38%" },
      { width: "6%", height: "18%", size: M, top: "36%", left: "48%" },
      { width: "6%", height: "18%", size: M, top: "52%", left: "58%" },
      { width: "6%", height: "18%", size: M, top: "68%", left: "68%" },
    ]
  },
  {
    id: "mx-5g",
    name: "Centered Diamond",
    frameCount: 5,
    frames: [
      { width: "8%", height: "16%", size: M, top: "8%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "30%", left: "33%" },
      { width: "8%", height: "16%", size: M, top: "30%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "30%", left: "59%" },
      { width: "8%", height: "16%", size: M, top: "52%", left: "46%" },
    ]
  },
  {
    id: "mx-5h",
    name: "Plus Grid (5)",
    frameCount: 5,
    frames: [
      { width: "8%", height: "16%", size: M, top: "10%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "32%", left: "33%" },
      { width: "8%", height: "16%", size: M, top: "32%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "32%", left: "59%" },
      { width: "8%", height: "16%", size: M, top: "54%", left: "46%" },
    ]
  },
  {
    id: "mx-5i",
    name: "Gallery Wall",
    frameCount: 5,
    frames: [
      { width: "14%", height: "18%", size: M, top: "20%", left: "26%" },
      { width: "14%", height: "34%", size: M, top: "12%", left: "44%" },
      { width: "14%", height: "18%", size: M, top: "20%", left: "62%" },
      { width: "10%", height: "14%", size: M, top: "50%", left: "30%" },
      { width: "10%", height: "14%", size: M, top: "50%", left: "58%" },
    ]
  },
  {
    id: "mx-5j",
    name: "Spiral / Organic",
    frameCount: 5,
    frames: [
      { width: "7%", height: "14%", size: M, top: "10%", left: "38%" },
      { width: "7%", height: "14%", size: M, top: "10%", left: "55%" },
      { width: "7%", height: "14%", size: M, top: "30%", left: "46%" },
      { width: "7%", height: "14%", size: M, top: "50%", left: "36%" },
      { width: "7%", height: "14%", size: M, top: "50%", left: "56%" },
    ]
  },
  {
    id: "mx-5k",
    name: "Anchored Symmetry",
    frameCount: 5,
    frames: [
      { width: "12%", height: "34%", size: M, top: "16%", left: "34%" },
      { width: "8%", height: "14%", size: M, top: "16%", left: "52%" },
      { width: "8%", height: "14%", size: M, top: "36%", left: "52%" },
      { width: "8%", height: "14%", size: M, top: "16%", left: "64%" },
      { width: "8%", height: "14%", size: M, top: "36%", left: "64%" },
    ]
  },
  {
    id: "mx-5l",
    name: "Grid Variation 1",
    frameCount: 5,
    frames: [
      { width: "9%", height: "18%", size: M, top: "12%", left: "32%" },
      { width: "9%", height: "18%", size: M, top: "12%", left: "50%" },
      { width: "9%", height: "18%", size: M, top: "12%", left: "68%" },
      { width: "9%", height: "18%", size: M, top: "38%", left: "41%" },
      { width: "9%", height: "18%", size: M, top: "38%", left: "59%" },
    ]
  },
  {
    id: "mx-5m",
    name: "Axis Alignment",
    frameCount: 5,
    frames: [
      { width: "8%", height: "24%", size: M, top: "8%", left: "30%" },
      { width: "12%", height: "16%", size: M, top: "12%", left: "44%" },
      { width: "8%", height: "24%", size: M, top: "8%", left: "62%" },
      { width: "12%", height: "16%", size: M, top: "40%", left: "36%" },
      { width: "12%", height: "16%", size: M, top: "40%", left: "54%" },
    ]
  },
  {
    id: "mx-5n",
    name: "Spiral Arrangement",
    frameCount: 5,
    frames: [
      { width: "8%", height: "22%", size: M, top: "6%", left: "36%" },
      { width: "8%", height: "22%", size: M, top: "6%", left: "56%" },
      { width: "8%", height: "22%", size: M, top: "34%", left: "46%" },
      { width: "8%", height: "22%", size: M, top: "62%", left: "36%" },
      { width: "8%", height: "22%", size: M, top: "62%", left: "56%" },
    ]
  },

  // =====================================================================
  // ===== 6+ PRINTS =====
  // =====================================================================
  {
    id: "mx-6a",
    name: "3×2 Grid",
    frameCount: 6,
    frames: [
      { width: "8%", height: "24%", size: M, top: "16%", left: "28%" },
      { width: "8%", height: "24%", size: M, top: "16%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "16%", left: "64%" },
      { width: "8%", height: "24%", size: M, top: "46%", left: "28%" },
      { width: "8%", height: "24%", size: M, top: "46%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "46%", left: "64%" },
    ]
  },
  {
    id: "mx-6b",
    name: "2×3 Grid",
    frameCount: 6,
    frames: [
      { width: "9%", height: "22%", size: M, top: "4%", left: "38%" },
      { width: "9%", height: "22%", size: M, top: "4%", left: "55%" },
      { width: "9%", height: "22%", size: M, top: "30%", left: "38%" },
      { width: "9%", height: "22%", size: M, top: "30%", left: "55%" },
      { width: "9%", height: "22%", size: M, top: "56%", left: "38%" },
      { width: "9%", height: "22%", size: M, top: "56%", left: "55%" },
    ]
  },
  {
    id: "mx-6c",
    name: "1×6 Horizontal Row",
    frameCount: 6,
    frames: [
      { width: "6%", height: "8%", size: M, top: "40%", left: "10%" },
      { width: "6%", height: "8%", size: M, top: "40%", left: "22%" },
      { width: "6%", height: "8%", size: M, top: "40%", left: "34%" },
      { width: "6%", height: "8%", size: M, top: "40%", left: "46%" },
      { width: "6%", height: "8%", size: M, top: "40%", left: "58%" },
      { width: "6%", height: "8%", size: M, top: "40%", left: "70%" },
    ]
  },
  {
    id: "mx-6d",
    name: "Paired Triptychs",
    frameCount: 6,
    frames: [
      { width: "8%", height: "16%", size: M, top: "12%", left: "28%" },
      { width: "8%", height: "16%", size: M, top: "12%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "12%", left: "64%" },
      { width: "8%", height: "16%", size: M, top: "36%", left: "28%" },
      { width: "8%", height: "16%", size: M, top: "36%", left: "46%" },
      { width: "8%", height: "16%", size: M, top: "36%", left: "64%" },
    ]
  },
  {
    id: "mx-6e",
    name: "Stair-Step Diagonal",
    frameCount: 6,
    frames: [
      { width: "6%", height: "18%", size: M, top: "2%", left: "26%" },
      { width: "6%", height: "18%", size: M, top: "16%", left: "36%" },
      { width: "6%", height: "18%", size: M, top: "30%", left: "46%" },
      { width: "6%", height: "18%", size: M, top: "44%", left: "56%" },
      { width: "6%", height: "18%", size: M, top: "58%", left: "66%" },
      { width: "6%", height: "18%", size: M, top: "72%", left: "76%" },
    ]
  },
  {
    id: "mx-6f",
    name: "4 + 2 Offset Block",
    frameCount: 6,
    frames: [
      { width: "7%", height: "21%", size: M, top: "10%", left: "24%" },
      { width: "7%", height: "21%", size: M, top: "10%", left: "39%" },
      { width: "7%", height: "21%", size: M, top: "10%", left: "54%" },
      { width: "7%", height: "21%", size: M, top: "10%", left: "69%" },
      { width: "7%", height: "21%", size: M, top: "40%", left: "39%" },
      { width: "7%", height: "21%", size: M, top: "40%", left: "54%" },
    ]
  },
  {
    id: "mx-6g",
    name: "3 × 3 Grid",
    frameCount: 9,
    frames: [
      { width: "8%", height: "20%", size: M, top: "6%", left: "30%" },
      { width: "8%", height: "20%", size: M, top: "6%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "6%", left: "62%" },
      { width: "8%", height: "20%", size: M, top: "30%", left: "30%" },
      { width: "8%", height: "20%", size: M, top: "30%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "30%", left: "62%" },
      { width: "8%", height: "20%", size: M, top: "54%", left: "30%" },
      { width: "8%", height: "20%", size: M, top: "54%", left: "46%" },
      { width: "8%", height: "20%", size: M, top: "54%", left: "62%" },
    ]
  },
  {
    id: "mx-6h",
    name: "2 × 3 Grid",
    frameCount: 6,
    frames: [
      { width: "9%", height: "22%", size: M, top: "6%", left: "36%" },
      { width: "9%", height: "22%", size: M, top: "6%", left: "55%" },
      { width: "9%", height: "22%", size: M, top: "32%", left: "36%" },
      { width: "9%", height: "22%", size: M, top: "32%", left: "55%" },
      { width: "9%", height: "22%", size: M, top: "58%", left: "36%" },
      { width: "9%", height: "22%", size: M, top: "58%", left: "55%" },
    ]
  },
  {
    id: "mx-6i",
    name: "3 × 2 Grid",
    frameCount: 6,
    frames: [
      { width: "8%", height: "24%", size: M, top: "18%", left: "26%" },
      { width: "8%", height: "24%", size: M, top: "18%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "18%", left: "66%" },
      { width: "8%", height: "24%", size: M, top: "48%", left: "26%" },
      { width: "8%", height: "24%", size: M, top: "48%", left: "46%" },
      { width: "8%", height: "24%", size: M, top: "48%", left: "66%" },
    ]
  },
  {
    id: "mx-6j",
    name: "4 × 4 Grid",
    frameCount: 16,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "6%", height: "14%", size: M, top: `${8 + r * 20}%`, left: `${28 + c * 12}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6k",
    name: "Offset Grid",
    frameCount: 6,
    frames: [
      { width: "9%", height: "20%", size: M, top: "10%", left: "32%" },
      { width: "9%", height: "20%", size: M, top: "10%", left: "52%" },
      { width: "9%", height: "20%", size: M, top: "36%", left: "42%" },
      { width: "9%", height: "20%", size: M, top: "36%", left: "62%" },
      { width: "9%", height: "20%", size: M, top: "62%", left: "32%" },
      { width: "9%", height: "20%", size: M, top: "62%", left: "52%" },
    ]
  },
  {
    id: "mx-6l",
    name: "2 × 4 Grid (Wide Eight)",
    frameCount: 8,
    frames: (() => {
      const f = []
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "7%", height: "16%", size: M, top: `${24 + r * 22}%`, left: `${24 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6m",
    name: "4 × 2 Grid (Tall Eight)",
    frameCount: 8,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          f.push({ width: "9%", height: "18%", size: M, top: `${4 + r * 22}%`, left: `${38 + c * 16}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6n",
    name: "3 × 4 Grid",
    frameCount: 12,
    frames: (() => {
      const f = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 3; c++) {
          f.push({ width: "7%", height: "16%", size: M, top: `${6 + r * 22}%`, left: `${33 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6o",
    name: "4 × 3 Grid",
    frameCount: 12,
    frames: (() => {
      const f = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          f.push({ width: "7%", height: "16%", size: M, top: `${14 + r * 22}%`, left: `${24 + c * 14}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6p",
    name: "2 × 5 Grid",
    frameCount: 10,
    frames: (() => {
      const f = []
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 2; c++) {
          f.push({ width: "8%", height: "14%", size: M, top: `${4 + r * 18}%`, left: `${38 + c * 16}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6q",
    name: "5 × 2 Grid",
    frameCount: 10,
    frames: (() => {
      const f = []
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 5; c++) {
          f.push({ width: "7%", height: "14%", size: M, top: `${26 + r * 20}%`, left: `${22 + c * 12}%` })
        }
      }
      return f
    })(),
  },
  {
    id: "mx-6r",
    name: "Staggered Brick",
    frameCount: 7,
    frames: [
      // Row 1 - 3
      { width: "8%", height: "18%", size: M, top: "8%", left: "30%" },
      { width: "8%", height: "18%", size: M, top: "8%", left: "46%" },
      { width: "8%", height: "18%", size: M, top: "8%", left: "62%" },
      // Row 2 - 2 offset
      { width: "8%", height: "18%", size: M, top: "32%", left: "38%" },
      { width: "8%", height: "18%", size: M, top: "32%", left: "54%" },
      // Row 3 - 2
      { width: "8%", height: "18%", size: M, top: "56%", left: "30%" },
      { width: "8%", height: "18%", size: M, top: "56%", left: "62%" },
    ]
  },
  {
    id: "mx-6s",
    name: "Pyramid",
    frameCount: 6,
    frames: [
      // Row 1 - 1
      { width: "9%", height: "20%", size: M, top: "6%", left: "45.5%" },
      // Row 2 - 2
      { width: "9%", height: "20%", size: M, top: "32%", left: "36%" },
      { width: "9%", height: "20%", size: M, top: "32%", left: "54%" },
      // Row 3 - 3
      { width: "9%", height: "20%", size: M, top: "58%", left: "27%" },
      { width: "9%", height: "20%", size: M, top: "58%", left: "45.5%" },
      { width: "9%", height: "20%", size: M, top: "58%", left: "63%" },
    ]
  },
  {
    id: "mx-6t",
    name: "Eclectic Mix",
    frameCount: 6,
    frames: [
      { width: "10%", height: "14%", size: M, top: "14%", left: "32%" },
      { width: "8%", height: "24%", size: M, top: "10%", left: "50%" },
      { width: "6%", height: "10%", size: M, top: "18%", left: "64%" },
      { width: "12%", height: "16%", size: M, top: "44%", left: "28%" },
      { width: "8%", height: "24%", size: M, top: "40%", left: "48%" },
      { width: "10%", height: "14%", size: M, top: "48%", left: "62%" },
    ]
  },
  {
    id: "mx-6u",
    name: "Studio Grid",
    frameCount: 8,
    frames: [
      // 4 rows × 2 cols
      { width: "8%", height: "20%", size: M, top: "2%", left: "38%" },
      { width: "8%", height: "20%", size: M, top: "2%", left: "54%" },
      { width: "8%", height: "20%", size: M, top: "26%", left: "38%" },
      { width: "8%", height: "20%", size: M, top: "26%", left: "54%" },
      { width: "8%", height: "20%", size: M, top: "50%", left: "38%" },
      { width: "8%", height: "20%", size: M, top: "50%", left: "54%" },
      { width: "8%", height: "20%", size: M, top: "74%", left: "38%" },
      { width: "8%", height: "20%", size: M, top: "74%", left: "54%" },
    ]
  },
  {
    id: "mx-6v",
    name: "Internal Axis",
    frameCount: 6,
    frames: [
      { width: "8%", height: "22%", size: M, top: "8%", left: "32%" },
      { width: "10%", height: "14%", size: M, top: "12%", left: "48%" },
      { width: "6%", height: "10%", size: M, top: "14%", left: "64%" },
      { width: "10%", height: "14%", size: M, top: "38%", left: "30%" },
      { width: "8%", height: "22%", size: M, top: "34%", left: "48%" },
      { width: "6%", height: "18%", size: M, top: "36%", left: "64%" },
    ]
  },
]
