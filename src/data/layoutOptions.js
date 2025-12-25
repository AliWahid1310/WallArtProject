export const layoutOptions = [
  {
    id: 1,
    name: "Two 50x70",
    image: "https://gwt.desenio.co.uk/walls/2-50x70.png",
    frames: [
      { width: "12%", height: "35%", size: "50X70", top: "20%", left: "37%" },
       { width: "12%", height: "35%", size: "50X70", top: "20%", right: "37%" }
    ]
  },
  {
    id: 2,
    name: "Two 70x100",
    image: "https://gwt.desenio.co.uk/walls/2-70x100.png",
    frames: [
      { width: "15%", height: "44%", size: "70x100", top: "20%", left: "34%" },
      { width: "15%", height: "44%", size: "70x100", top: "20%", right: "34%" }
    ]
  },
  {
    id: 3,
    name: "Three 50x70",
    image: "https://gwt.desenio.co.uk/walls/3-50x70.png",
    frames: [
      { width: "12%", height: "35%", size: "50x70", top: "25%", left: "30%" },
      { width: "12%", height: "35%", size: "50x70", top: "25%", left: "50%", transform: "translateX(-50%)" },
      { width: "12%", height: "35%", size: "50x70", top: "25%", right: "30%" }
    ]
  },
  {
    id: 4,
    name: "Center 70x100 + Sides",
    image: "https://gwt.desenio.co.uk/walls/3-mixed.png",
    frames: [
      { width: "11.5%", height: "31.25%", size: "50x75", top: "27%", left: "30%" },
      { width: "15%", height: "44%", size: "70x100", top: "20%", left: "50%", transform: "translateX(-50%)" },
      { width: "11.5%", height: "31.25%", size: "50x75", top: "27%", right: "30%", }
    ]
  },
  {
    id: 5,
    name: "Four 30x40 Grid",
    image: "https://gwt.desenio.co.uk/walls/4-30x40.png",
    frames: [
      { width: "9%", height: "27%", size: "30x40", top: "15%", left: "39.95%" },
      { width: "9%", height: "27%", size: "30x40", top: "15%", right: "39.95%" },
      { width: "9%", height: "27%", size: "30x40", bottom: "30%", left: "39.95%" },
      { width: "9%", height: "27%", size: "30x40", bottom: "30%", right: "39.95%" }
    ]
  },
  {
    id: 6,
    name: "Four Row Mix",
    image: "https://gwt.desenio.co.uk/walls/4-mixed.png",
    frames: [
      { width: "9%", height: "27%", size: "30x40", top: "27%", left: "27.7%" },
      { width: "12%", height: "35%", size: "50x70", top: "23%", left: "37.5%" },
      { width: "12%", height: "35%", size: "50x70", top: "23%", right: "37.5%" },
      { width: "9%", height: "27%", size: "30x40", top: "27%", right: "27.7%" }
    ]
  },
  {
    id: 7,
    name: "Gallery Wall Mix",
    image: "https://gwt.desenio.co.uk/walls/4-mixed-2.png",
    frames: [
     // TOP LEFT — 50x70 (HORIZONTAL)
{
  width: "16%",
  height: "21%",
  size: "50x70",
  top: "10%",
  left: "35.5%"
},

// RIGHT — 70x100 (VERTICAL)
{
  width: "16%",
  height: "48%",
  size: "70x100",
  top: "10%",
  left: "52%"
},

// BOTTOM LEFT — 30x40 (VERTICAL)
{
  width: "9%",
  height: "27%",
  size: "30x40",
  top: "32%",
  left: "30%"
},

// BOTTOM CENTER — 50x70 (VERTICAL)
{
  width: "12%",
  height: "35%",
  size: "50x70",
  top: "32%",
  left: "39.5%"
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
  width: "12%",
  height: "35%",
  size: "50x70",
  top: "12%",
  left: "36%"
},

// RIGHT — 50x50 (square, top right)
{
  width: "12%",
  height: "23%",
  size: "50x50",
  top: "12%",
  left: "48.5%"
},

// RIGHT — 30x40 (vertical, below the square)
{
  width: "8.4%",
  height: "22%",
  size: "30x40",
  top: "36%",
  left: "48.5%"
},

// RIGHT — 13x18 (small vertical, to the right of 30x40)
{
  width: "3.6%",
  height: "11%",
  size: "13x18",
  top: "36%",
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
  width: "6.3%",
  height: "15.75%",
  size: "21x30",
  top: "24%",
  left: "26.7%"
},

// LEFT TOP — 30x40 (top of the left stack)
{
  width: "8.4%",
  height: "22%",
  size: "30x40",
  top: "10%",
  left: "33.5%"
},

// LEFT BOTTOM — 30x40 (below the first 30x40)
{
  width: "8.4%",
  height: "22%",
  size: "30x40",
  top: "33%",
  left: "33.5%"
},

// CENTER — 70x100 (big center piece)
{
  width: "16%",
  height: "48%",
  size: "70x100",
  top: "8%",
  left: "50.5%",
  transform: "translateX(-50%)"
},

// RIGHT — 50x70 (single piece on the right)
{
  width: "12%",
  height: "35%",
  size: "50x70",
  top: "15%",
  right: "28.8%"
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
width: "9.8%",
height: "25%",
size: "40x50",
top: "8%",
left: "31.5%"
},

// LEFT — 50x70 (under the 40x50)
{
width: "12%",
height: "35%",
size: "50x70",
top: "34.5%",
left: "29.3%"
},

// CENTER — 70x100 (big)
{
width: "16%",
height: "48%",
size: "70x100",
top: "6%",
left: "50%",
transform: "translateX(-50%)"
},

// RIGHT TOP — 50x70 (top right)
{
width: "12%",
height: "35%",
size: "50x70",
top: "6%",
right: "29.2%"
},

// RIGHT MID — 40x50
{
width: "9.8%",
height: "25%",
size: "40x50",
top: "42%",
right: "31.5%"
},

// RIGHT MID — 30x40 **horizontal**
{
width: "10%",
height: "15%",
size: "30x40",
top: "42%",
right: "21%"
},

// BOTTOM LEFT OF CENTER — 30x40 **horizontal**
{
width: "10%",
height: "15%",
size: "30x40",
top: "54.5%",
left: "42%"
},

// BOTTOM CENTER — 21x30 **horizontal**
{
width: "5.7%",
height: "15%",
size: "21x30",
top: "54.5%",
left: "55.2%",
transform: "translateX(-50%)"
}
    ]
  }
]
