"use client"

import { useState } from "react"

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState("intro")
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [selectedBackground, setSelectedBackground] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const [activeVariants, setActiveVariants] = useState({})
  const [expandedSection, setExpandedSection] = useState(null)

  // Room/Place Categories
  const placeCategories = [
    {
      id: "living-room",
      name: "Living Room",
      image: "PLACEHOLDER_IMAGE_URL_1",
      description: "Modern and cozy living spaces"
    },
    {
      id: "bedroom",
      name: "Bedroom",
      image: "PLACEHOLDER_IMAGE_URL_2",
      description: "Relaxing bedroom environments"
    },
    {
      
      id: "dining-room",
      name: "Dining Room",
      image: "PLACEHOLDER_IMAGE_URL_3",
      description: "Elegant dining areas"
    },
    {
      id: "home-office",
      name: "Home Office",
      image: "PLACEHOLDER_IMAGE_URL_4",
      description: "Productive workspace settings"
    },
    {
      id: "hallway",
      name: "Hallway",
      image: "PLACEHOLDER_IMAGE_URL_5",
      description: "Welcoming entrance spaces"
    },
    {
      id: "kids-room",
      name: "Kids Room",
      image: "PLACEHOLDER_IMAGE_URL_6",
      description: "Fun and playful children's rooms"
    }
  ]

  const layoutOptions = [
    {
      id: 1,
      name: "Two 50x70",
      image: "https://gwt.desenio.co.uk/walls/2-50x70.png",
      frames: [
        { width: "200px", height: "280px", size: "50X70", top: "20%", left: "36%" },
         { width: "200px", height: "280px", size: "50X70", top: "20%", right: "36%" }
      ]
    },
    {
      id: 2,
      name: "Two 70x100",
      image: "https://gwt.desenio.co.uk/walls/2-70x100.png",
      frames: [
        { width: "175px", height: "250px", size: "70x100", top: "20%", left: "36%" },
        { width: "175px", height: "250px", size: "70x100", top: "20%", right: "36%" }
      ]
    },
    {
      id: 3,
      name: "Three 50x70",
      image: "https://gwt.desenio.co.uk/walls/3-50x70.png",
      frames: [
        { width: "180px", height: "252px", size: "50x70", top: "25%", left: "30%" },
        { width: "180px", height: "252px", size: "50x70", top: "25%", left: "50%", transform: "translateX(-50%)" },
        { width: "180px", height: "252px", size: "50x70", top: "25%", right: "30%" }
      ]
    },
    {
      id: 4,
      name: "Center 70x100 + Sides",
      image: "https://gwt.desenio.co.uk/walls/3-mixed.png",
      frames: [
        { width: "150px", height: "210px", size: "50x75", top: "25%", left: "33%" },
        { width: "200px", height: "285px", size: "70x100", top: "20%", left: "50%", transform: "translateX(-50%)" },
        { width: "150px", height: "210px", size: "50x75", top: "25%", right: "33%", }
      ]
    },
    {
      id: 5,
      name: "Four 30x40 Grid",
      image: "https://gwt.desenio.co.uk/walls/4-30x40.png",
      frames: [
        { width: "150px", height: "200px", size: "30x40", top: "15%", left: "40%" },
        { width: "150px", height: "200px", size: "30x40", top: "15%", right: "40%" },
        { width: "150px", height: "200px", size: "30x40", bottom: "30%", left: "40%" },
        { width: "150px", height: "200px", size: "30x40", bottom: "30%", right: "40%" }
      ]
    },
    {
      id: 6,
      name: "Four Row Mix",
      image: "https://gwt.desenio.co.uk/walls/4-mixed.png",
      frames: [
        { width: "120px", height: "160px", size: "30x40", top: "26%", left: "31%" },
        { width: "150px", height: "210px", size: "50x75", top: "23%", left: "40%" },
        { width: "150px", height: "210px", size: "50x75", top: "23%", right: "40%" },
        { width: "120px", height: "160px", size: "30x40", top: "26%", right: "31%" }
      ]
    },
    {
      id: 7,
      name: "Gallery Wall Mix",
      image: "https://gwt.desenio.co.uk/walls/4-mixed-2.png",
      frames: [
       // TOP LEFT — 50x70 (HORIZONTAL)
  {
    width: "220px",
    height: "160px",
    size: "50x70",
    top: "8%",
    left: "35%"
  },

  // RIGHT — 70x100 (VERTICAL)
  {
    width: "240px",
    height: "340px",
    size: "70x100",
    top: "12%",
    left: "50%"
  },

  // BOTTOM LEFT — 30x40 (VERTICAL)
  {
    width: "120px",
    height: "160px",
    size: "30x40",
    top: "30%",
    left: "30%"
  },

  // BOTTOM CENTER — 50x70 (VERTICAL)
  {
    width: "160px",
    height: "225px",
    size: "50x70",
    top: "30%",
    left: "38.7%"
  }
      ]
    },
    {
      id: 8,
      name: "Asymmetric Collection",
      image: "https://gwt.desenio.co.uk/walls/4-mixed-3.png",
      frames: [
        // LEFT — 50x70 (vertical big)
  {
    width: "180px",
    height: "252px",
    size: "50x70",
    top: "12%",
    left: "37%"
  },

  // RIGHT — 50x50 (square, top right)
  {
    width: "160px",
    height: "160px",
    size: "50x50",
    top: "12%",
    left: "49%"
  },

  // RIGHT — 30x40 (vertical, below the square)
  {
    width: "120px",
    height: "160px",
    size: "30x40",
    top: "34%",
    left: "49%"
  },

  // RIGHT — 13x18 (small vertical, to the right of 30x40)
  {
    width: "80px",
    height: "112px",
    size: "13x18",
    top: "34%",
    left: "57%"
  }
      ]
    },
    {
      id: 9,
      name: "Large Center + Corners",
      image: "https://gwt.desenio.co.uk/walls/5-mixed.png",
      frames: [
        // LEFT — small 21x30 (slightly left of the two 30x40s)
  {
    width: "90px",            // 21x30 scaled
    height: "126px",
    size: "21x30",
    top: "25%",              // vertically between the two 30x40 elements
    left: "27.2%"
  },

  // LEFT TOP — 30x40 (top of the left stack)
  {
    width: "120px",
    height: "160px",
    size: "30x40",
    top: "11%",
    left: "33.5%"
  },

  // LEFT BOTTOM — 30x40 (below the first 30x40)
  {
    width: "120px",
    height: "160px",
    size: "30x40",
    top: "33%",
    left: "33.5%"
  },

  // CENTER — 70x100 (big center piece)
  {
    width: "260px",
    height: "370px",
    size: "70x100",
    top: "8%",
    left: "50%",
    transform: "translateX(-50%)"
  },

  // RIGHT — 50x70 (single piece on the right)
  {
    width: "180px",
    height: "252px",
    size: "50x70",
    top: "16%",
    right: "29.8%"
  }
      ]
    },
    {
      id: 10,
      name: "Creative Cluster",
      image: "https://gwt.desenio.co.uk/walls/large-wall.png",
      frames: [
     // LEFT — 40x50 (top left)
{
  width: "140px",
  height: "175px",
  size: "40x50",
  top: "8%",
  left: "31.5%"
},

// LEFT — 50x70 (under the 40x50)
{
  width: "160px",
  height: "225px",
  size: "50x70",
  top: "32%",
  left: "30.22%"
},

// CENTER — 70x100 (big)
{
  width: "280px",
  height: "360px",
  size: "70x100",
  top: "6%",
  left: "50%",
  transform: "translateX(-50%)"
},

// RIGHT TOP — 50x70 (top right)
{
  width: "180px",
  height: "252px",
  size: "50x70",
  top: "6%",
  right: "29%"
},

// RIGHT MID — 40x50
{
  width: "140px",
  height: "175px",
  size: "40x50",
  top: "39.5%",
  right: "31.5%"
},

// RIGHT MID — 30x40 **horizontal**
{
  width: "160px",
  height: "120px",
  size: "30x40",
  top: "39.5%",
  right: "21%"
},

// BOTTOM LEFT OF CENTER — 30x40 **horizontal**
{
  width: "180px",
  height: "120px",
  size: "30x40",
  top: "54%",
  left: "42%"
},

// BOTTOM CENTER — 21x30 **horizontal**
{
  width: "75px",
  height: "120px",
  size: "21x30",
  top: "54%",
  left: "56%",
  transform: "translateX(-50%)"
}
      ]
    }
  ]

  const backgroundOptions = [
    { 
      section: "Modern Living Room",
      variants: [
        { id: "bg-1-white", name: "White Wall", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-grey.jpg" },
        { id: "bg-1-grey", name: "Grey Wall", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-white.jpg" },
        { id: "bg-1-blue", name: "Blue Wall", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-blue.jpg" },
        { id: "bg-1-sage", name: "Sage Wall", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-green.jpg" },
        { id: "bg-1-pink", name: "Pink Wall", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-pink.jpg" }
      ]
    },
    { 
      section: "Contemporary Space",
      variants: [
        { id: "bg-2-white", name: "White Minimal", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-grey.jpg" },
        { id: "bg-2-grey", name: "Grey Minimal", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-white.jpg" },
        { id: "bg-2-blue", name: "Blue Minimal", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-blue.jpg" },
        { id: "bg-2-sage", name: "Sage Minimal", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-pink.jpg" },
      ]
    },
    { 
      section: "Cozy Corner",
      variants: [
        { id: "bg-3-white", name: "White Cozy", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/6-grey.jpg" },
        { id: "bg-3-grey", name: "Grey Cozy", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/6-blue.jpg" },
      ]
    },
    { 
      section: "Scandinavian Style",
      variants: [
        { id: "bg-4-grey", name: "Grey Nordic", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-grey.jpg" },
        { id: "bg-4-blue", name: "Blue Nordic", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-blue.jpg" },
        { id: "bg-4-pink", name: "Pink Nordic", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-pink.jpg" }
      ]
    },
    { 
      section: "Urban Loft",
      variants: [
        { id: "bg-5-white", name: "White Industrial", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-white.jpg" },
        { id: "bg-5-grey", name: "Grey Industrial", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-grey.jpg" },
        { id: "bg-5-blue", name: "Blue Industrial", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-blue.jpg" },
        { id: "bg-5-pink", name: "Pink Industrial", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-pink.jpg" }
      ]
    },
    { 
      section: "Classic Elegance",
      variants: [
        { id: "bg-6-white", name: "White Classic", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-white.jpg" },
        { id: "bg-6-grey", name: "Grey Classic", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-grey.jpg" },
        { id: "bg-6-blue", name: "Blue Classic", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-green.jpg" },
      ]
    },
    { 
      section: "Minimalist Studio",
      variants: [
        { id: "bg-7-grey", name: "Grey Studio", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-grey.jpg" },
        { id: "bg-7-blue", name: "Blue Studio", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-blue.jpg" },
        { id: "bg-7-sage", name: "Sage Studio", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-dark.jpg" },
        { id: "bg-7-pink", name: "Pink Studio", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-green.jpg" }
      ]
    }
  ]

  // Intro page (original)
  if (currentStep === "intro") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-300 px-6 py-8 flex flex-col">
          {/* Logo */}
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-center">DESENIO</h1>

          {/* Steps Container */}
          <div className="flex-1 flex flex-col justify-start pt-4 space-y-8">
            {/* Step 1 - NEW: Select Place */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* House/Room icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-10 h-10">
                  <div className="w-8 h-6 border-2 border-b-0 border-black group-hover:border-gray-400 transition-colors"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[12px] border-b-black group-hover:border-b-gray-400 transition-colors"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-black group-hover:bg-gray-400 transition-colors"></div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">1</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT PLACE</p>
            </div>

            {/* Step 2 - Background */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Overlapping frames icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-10 h-10">
                  {/* Back frame */}
                  <div className="absolute top-0 right-0 w-7 h-9 border-2 border-black group-hover:border-gray-400 bg-white transition-colors transform rotate-6"></div>
                  {/* Front frame */}
                  <div className="absolute top-1 left-0 w-7 h-9 border-2 border-black group-hover:border-gray-400 bg-white transition-colors">
                    {/* Small image representation inside frame */}
                    <div className="absolute inset-2 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">2</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT BACKGROUND</p>
            </div>

            {/* Step 3 - Picture Wall */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Picture wall layout icon */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-1 items-start">
                  {/* Large rectangle on left */}
                  <div className="w-5 h-8 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  {/* Two smaller rectangles stacked on right */}
                  <div className="flex flex-col gap-1">
                    <div className="w-2 h-3.5 bg-black group-hover:bg-gray-400 transition-colors"></div>
                    <div className="w-2 h-3.5 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">3</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT PICTURE WALL</p>
            </div>

            {/* Step 4 - Design */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Tall rectangle with circle icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-6 h-9 border-2 border-black group-hover:border-gray-400 flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-black group-hover:bg-gray-400 rounded-full transition-colors"></div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">4</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT DESIGN</p>
            </div>

            {/* Step 5 - Frame */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Empty tall rectangle icon */}
              <div className="flex justify-center mb-4">
                <div className="w-6 h-9 border-2 border-black group-hover:border-gray-400 transition-colors"></div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">5</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">FRAME YOUR DESIGNS</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto space-y-6">
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-center">£ 0</p>
            </div>

            {/* Add to Basket Button */}
            <button className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95">
              ADD TO <span>🛍️</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">0</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105">
                CHECKOUT £0
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Hero Section */}
          <div
            className="flex-1 relative bg-cover bg-center"
            style={{
              backgroundImage: "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-8">
              {/* Dark Box Container */}
              <div className="bg-black/70 backdrop-blur-sm px-20 py-16 max-w-3xl">
                <p className="text-xs tracking-[0.3em] mb-6 text-gray-300 font-light">STEP-BY-STEP</p>
                <h2 className="text-5xl font-serif italic mb-8 text-white font-light leading-tight">
                  Create the perfect gallery wall
                </h2>
                <p className="text-base mb-12 text-gray-200 font-light leading-relaxed">
                  Use our new tool to find designs and frames that match each other
                </p>
                <button
                  onClick={() => setCurrentStep("step1")}
                  className="bg-white text-black px-12 py-4 font-bold text-sm tracking-widest hover:bg-gray-100 border-2 border-white hover:border-black transition-all duration-300 cursor-pointer"
                >
                  START HERE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 1: Select Place/Room Category
  if (currentStep === "step1") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">1. SELECT PLACE</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Place Options */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {placeCategories.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`relative cursor-pointer transition-all duration-300 group ${
                    selectedPlace?.id === place.id 
                      ? 'ring-2 ring-black ring-offset-2' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  {/* Place Image */}
                  <div className="relative h-40 bg-gray-200 overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    {selectedPlace?.id === place.id && (
                      <div className="absolute top-3 left-3 bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                        <span className="text-lg font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Place Info */}
                  <div className="p-4 bg-white border border-t-0 border-gray-200">
                    <h3 className="text-base font-bold text-black mb-1">{place.name}</h3>
                    <p className="text-xs text-gray-600">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button - Fixed at bottom */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button 
              disabled={!selectedPlace}
              onClick={() => selectedPlace && setCurrentStep("step2")}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">0</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £0
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Display - Show selected place or default */}
          <div
            className="flex-1 relative bg-cover bg-center"
            style={{
              backgroundImage: selectedPlace 
                ? `url(${selectedPlace.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            {!selectedPlace && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-12 py-8 rounded-lg shadow-xl">
                  <p className="text-2xl font-light text-gray-700 text-center">
                    Select a place to continue
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Select Background
  if (currentStep === "step2") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-70 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">2. SELECT BACKGROUND</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Background Options */}
          <div className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-6">
              {backgroundOptions.map((section, sectionIdx) => {
                const activeVariant = activeVariants[sectionIdx] || section.variants[0]
                
                return (
                  <div key={sectionIdx}>
                    {/* Background Image */}
                    <div
                      className={`relative w-full aspect-[16/9] bg-cover bg-center transition-all duration-300 cursor-pointer ${
                        selectedBackground?.id === activeVariant.id 
                          ? 'ring-2 ring-black ring-offset-2' 
                          : 'hover:opacity-90'
                      }`}
                      style={{
                        backgroundImage: `url(${activeVariant.image})`
                      }}
                      onClick={() => {
                        setExpandedSection(expandedSection === sectionIdx ? null : sectionIdx)
                        setSelectedBackground(activeVariant)
                      }}
                    >
                      {selectedBackground?.id === activeVariant.id && (
                        <div className="absolute top-3 left-3 bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                          <span className="text-lg font-bold">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Color Swatches - Show only when section is expanded */}
                    {expandedSection === sectionIdx && (
                      <div className="flex gap-2 mt-3 animate-fadeIn">
                        {section.variants.map((variant) => (
                          <div
                            key={variant.id}
                            className={`w-10 h-10 border-2 cursor-pointer transition-all duration-200 ${
                              activeVariant.id === variant.id 
                                ? 'border-black scale-110' 
                                : 'border-gray-300 hover:border-gray-600'
                            }`}
                            style={{ backgroundColor: variant.color }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveVariants({ ...activeVariants, [sectionIdx]: variant })
                              setSelectedBackground(variant)
                            }}
                            title={variant.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button 
              disabled={!selectedBackground}
              onClick={() => selectedBackground && setCurrentStep("step3")}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
            <button 
              onClick={() => setCurrentStep("step1")}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">0</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £0
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Background Display */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Select Picture Wall Layout
  if (currentStep === "step3") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">3. SELECT PICTURE WALL</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Layout Options */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6 mb-6">
            {layoutOptions.map((layout) => (
              <div
                key={layout.id}
                onClick={() => setSelectedLayout(layout)}
                className="relative cursor-pointer transition-all duration-200 group hover:shadow-lg"
              >
                {/* Layout Preview */}
                <div className="relative h-48 bg-white group-hover:bg-gray-50">
                  {layout.image ? (
                    /* Image-based preview */
                    <img 
                      src={layout.image} 
                      alt={layout.name}
                      className="w-full h-full object-contain transition-all duration-200 group-hover:opacity-80 cursor-pointer"
                    />
                  ) : (
                    /* Fallback to frame boxes */
                    layout.frames.map((frame, idx) => (
                      <div
                        key={idx}
                        className={`absolute bg-gray-300 border border-gray-400 flex items-center justify-center transition-all duration-200 ${
                          selectedLayout?.id === layout.id ? 'border-black border-2' : 'group-hover:border-gray-600 group-hover:bg-gray-400'
                        }`}
                        style={{
                          width: `${parseInt(frame.width) / 3.5}px`,
                          height: `${parseInt(frame.height) / 3.5}px`,
                          top: frame.top ? `${parseInt(frame.top) / 1.8}%` : undefined,
                          bottom: frame.bottom ? `${parseInt(frame.bottom) / 1.8}%` : undefined,
                          left: frame.left ? `${parseInt(frame.left) / 1.8}%` : undefined,
                          right: frame.right ? `${parseInt(frame.right) / 1.8}%` : undefined,
                          transform: frame.transform
                        }}
                      >
                        <div className="text-[9px] text-gray-600 font-semibold">
                          {frame.size}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Selected Indicator */}
                  {selectedLayout?.id === layout.id && (
                    <div className="absolute top-2 left-2 bg-black text-white rounded w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button 
              disabled={!selectedLayout}
              className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
            <button 
              onClick={() => setCurrentStep("step2")}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                💾 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ↗ SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">0</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £0
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-400 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Canvas with Background and Frames */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            {/* Frame Placeholders - Only show when layout is selected */}
            {selectedLayout && selectedLayout.frames.map((frame, idx) => (
              <div
                key={idx}
                className="absolute bg-gray-300 border-2 border-gray-400 flex items-center justify-center transition-all duration-300"
                style={{
                  width: frame.width,
                  height: frame.height,
                  top: frame.top,
                  bottom: frame.bottom,
                  left: frame.left,
                  right: frame.right,
                  transform: frame.transform
                }}
              >
                <span className="text-gray-600 font-semibold text-sm">
                  {frame.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
