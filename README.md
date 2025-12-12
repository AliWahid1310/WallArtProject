# Gallery Wall Configurator

A complete React + JavaScript + Tailwind CSS application for building and customizing gallery walls.

## 🎨 Features

- **4-Step Wizard Process**
  1. Select Background (wall color/texture)
  2. Select Layout (frame arrangement templates)
  3. Select Artwork/Posters
  4. Select Frames

- **Three-Panel Layout**
  - **Left Sidebar**: Step navigation + dynamic product list
  - **Center Canvas**: Interactive preview with zoom controls
  - **Right Sidebar**: Cart management, saved walls, and checkout

- **Core Functionality**
  - Real-time price calculation
  - Save and load configurations (localStorage)
  - Filter and search artworks
  - Responsive design (mobile & desktop)
  - Prepared for Shopify Ajax API integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
gallery-proj/
├── src/
│   ├── components/          # React components
│   │   ├── LeftSidebar.jsx
│   │   ├── Canvas.jsx
│   │   └── RightSidebar.jsx
│   ├── context/            # Global state management
│   │   └── AppContext.jsx
│   ├── data/              # Product data
│   │   ├── backgrounds.js
│   │   ├── layouts.js
│   │   ├── artworks.js
│   │   └── frames.js
│   ├── pages/             # Page components (to be built)
│   ├── utils/             # Helper functions
│   │   └── helpers.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # App entry point
│   └── index.css          # Tailwind CSS imports
├── public/                # Static assets
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.js         # Vite configuration
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **JavaScript** - No TypeScript
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router DOM** - Navigation (installed, ready to use)

## 📦 Product Data

The app includes sample data for:
- **9 Backgrounds** - Solid colors and textures
- **6 Layouts** - From single frame to 9-frame grids
- **16 Artworks** - Various categories (abstract, landscape, botanical, etc.)
- **12 Frames** - Wood and metal finishes

## 🔧 State Management

Global state is managed through React Context (`AppContext.jsx`):
- Current wizard step
- Selected items (background, layout, artworks, frames)
- Cart items
- Saved configurations
- Canvas zoom level

## 💾 Data Persistence

Configurations are automatically saved to `localStorage`:
- Save custom gallery wall designs
- Load previously saved designs
- Delete unwanted designs

## 🎯 Next Steps (Build Step by Step)

Ready to build pages incrementally:
1. Background selection page
2. Layout selection page
3. Artwork selection page with filters
4. Frame selection page
5. Enhanced canvas rendering
6. Mobile responsive improvements
7. Shopify integration

## 📝 Notes

- All components are functional components using React Hooks
- Clean, production-ready code with comments
- Modular structure for easy maintenance
- Prepared for Shopify Ajax API cart integration

## 🤝 Development

Wait for specific commands to build individual pages and features step by step.

---

Built with ❤️ using React + JavaScript + Tailwind CSS
