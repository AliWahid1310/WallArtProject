// Layout templates for Step 2: Frame arrangements
export const layouts = [
  {
    id: 'layout-1',
    name: 'Single Large',
    description: '1 large frame centered',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Single',
    frameCount: 1,
    positions: [
      { x: 50, y: 50, width: 40, height: 50 }, // percentages
    ],
  },
  {
    id: 'layout-2',
    name: 'Gallery Grid 2x2',
    description: '4 frames in a balanced grid',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Grid+2x2',
    frameCount: 4,
    positions: [
      { x: 30, y: 30, width: 20, height: 25 },
      { x: 70, y: 30, width: 20, height: 25 },
      { x: 30, y: 70, width: 20, height: 25 },
      { x: 70, y: 70, width: 20, height: 25 },
    ],
  },
  {
    id: 'layout-3',
    name: 'Gallery Grid 3x3',
    description: '9 frames in a uniform grid',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Grid+3x3',
    frameCount: 9,
    positions: [
      { x: 20, y: 20, width: 15, height: 18 },
      { x: 50, y: 20, width: 15, height: 18 },
      { x: 80, y: 20, width: 15, height: 18 },
      { x: 20, y: 50, width: 15, height: 18 },
      { x: 50, y: 50, width: 15, height: 18 },
      { x: 80, y: 50, width: 15, height: 18 },
      { x: 20, y: 80, width: 15, height: 18 },
      { x: 50, y: 80, width: 15, height: 18 },
      { x: 80, y: 80, width: 15, height: 18 },
    ],
  },
  {
    id: 'layout-4',
    name: 'Asymmetric Mix',
    description: '1 large + 4 small frames',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Asymmetric',
    frameCount: 5,
    positions: [
      { x: 35, y: 50, width: 35, height: 45 }, // large center
      { x: 70, y: 25, width: 15, height: 18 },
      { x: 70, y: 50, width: 15, height: 18 },
      { x: 70, y: 75, width: 15, height: 18 },
      { x: 15, y: 50, width: 15, height: 18 },
    ],
  },
  {
    id: 'layout-5',
    name: 'Horizontal Row',
    description: '3 frames in a row',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Row',
    frameCount: 3,
    positions: [
      { x: 25, y: 50, width: 18, height: 25 },
      { x: 50, y: 50, width: 18, height: 25 },
      { x: 75, y: 50, width: 18, height: 25 },
    ],
  },
  {
    id: 'layout-6',
    name: 'Salon Style',
    description: '7 frames in organic arrangement',
    price: 0,
    thumbnail: 'https://via.placeholder.com/150/E5E5E5/000000?text=Salon',
    frameCount: 7,
    positions: [
      { x: 50, y: 40, width: 25, height: 30 }, // center large
      { x: 25, y: 25, width: 12, height: 15 },
      { x: 75, y: 25, width: 12, height: 15 },
      { x: 20, y: 65, width: 15, height: 18 },
      { x: 45, y: 75, width: 12, height: 15 },
      { x: 70, y: 65, width: 15, height: 18 },
      { x: 85, y: 45, width: 10, height: 12 },
    ],
  },
];
