// Room images imported from local assets using Vite's glob import
// Each key matches a placeCategory id

const _bedrooms     = import.meta.glob('../assets/Bedrooms/*.jpg',       { eager: true })
const _livingRooms  = import.meta.glob('../assets/Living Rooms/**/*.jpg',{ eager: true })
const _diningRooms  = import.meta.glob('../assets/Dining Rooms/*.jpg',   { eager: true })
const _hallway      = import.meta.glob('../assets/Hallway/*.jpg',        { eager: true })
const _kitchens     = import.meta.glob('../assets/Kitchens/*.jpg',       { eager: true })
const _nursery      = import.meta.glob('../assets/Nursery/*.jpg',        { eager: true })
const _office       = import.meta.glob('../assets/Office/*.jpg',         { eager: true })
const _teenBedrooms = import.meta.glob('../assets/Teen Bedrooms/*.jpg',  { eager: true })

/** Convert a glob result to a sorted array of resolved image URLs */
const toUrls = (raw) =>
  Object.entries(raw)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => mod.default)

export const roomImages = {
  'living-room':   toUrls(_livingRooms),
  'bedroom':       toUrls(_bedrooms),
  'dining-room':   toUrls(_diningRooms),
  'hallway':       toUrls(_hallway),
  'kitchen':       toUrls(_kitchens),
  'kids-room':     toUrls(_nursery),
  'home-office':   toUrls(_office),
  'teen-bedroom':  toUrls(_teenBedrooms),
}
