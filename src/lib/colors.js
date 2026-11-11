export const INITIAL_COLORS = ['#F8E8D4', '#F2A898', '#B6D7CF', '#457B83', '#23343D']

const SCHEMES = [
  { name: 'Analogous tones, effortlessly in sync.', offsets: [-37, -16, 0, 19, 40] },
  { name: 'A playful complementary color story.', offsets: [-25, 0, 155, 180, 200] },
  { name: 'A colorful little triad.', offsets: [-15, 0, 114, 135, 238] },
  { name: 'Soft monochrome, maximum mood.', offsets: [-8, -4, 0, 4, 8] },
  { name: 'Split complementary and full of life.', offsets: [-25, 0, 145, 180, 215] },
]

export function hexToRgb(hex) {
  const number = Number.parseInt(hex.slice(1), 16)
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255]
}

function hexToHsl(hex) {
  const [red, green, blue] = hexToRgb(hex).map(channel => channel / 255)
  const maximum = Math.max(red, green, blue)
  const minimum = Math.min(red, green, blue)
  let hue = 0
  let saturation = 0
  const lightness = (maximum + minimum) / 2
  if (maximum !== minimum) {
    const delta = maximum - minimum
    saturation = delta / (1 - Math.abs(2 * lightness - 1))
    switch (maximum) {
      case red: hue = ((green - blue) / delta) % 6; break
      case green: hue = (blue - red) / delta + 2; break
      default: hue = (red - green) / delta + 4
    }
    hue = (hue * 60 + 360) % 360
  }
  return [hue, saturation * 100, lightness * 100]
}

function hslToHex(hue, saturation, lightness) {
  const s = saturation / 100
  const l = lightness / 100
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const m = l - chroma / 2
  const [r, g, b] = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x]
  return '#' + [r, g, b].map(value => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()
}

export function nameColor(hex) {
  const [hue, saturation, lightness] = hexToHsl(hex)
  if (lightness < 19) return 'Midnight ink'
  if (saturation < 12) return lightness > 82 ? 'Soft ivory' : lightness < 40 ? 'Charcoal' : 'Stone grey'
  const shade = lightness > 82 ? 'Pale' : lightness > 65 ? 'Soft' : lightness > 43 ? 'Warm' : lightness > 27 ? 'Deep' : 'Dark'
  const color = hue < 14 ? 'coral' : hue < 40 ? 'peach' : hue < 65 ? 'gold' : hue < 87 ? 'lime' : hue < 150 ? 'sage' : hue < 185 ? 'mint' : hue < 205 ? 'aqua' : hue < 245 ? 'blue' : hue < 272 ? 'indigo' : hue < 306 ? 'lilac' : hue < 337 ? 'pink' : 'rose'
  return `${shade} ${color}`
}

export function textColorFor(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel => {
    const value = channel / 255
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4
  })
  const luminance = .2126 * r + .7152 * g + .0722 * b
  return luminance > .28 ? '#23302b' : '#ffffff'
}

export function generatePalette() {
  const base = Math.floor(Math.random() * 360)
  const scheme = SCHEMES[Math.floor(Math.random() * SCHEMES.length)]
  const lightnesses = [87, 74, 58, 42, 25]
  const saturations = [62, 60, 49, 48, 45]
  const colors = scheme.offsets.map((offset, index) => {
    const hue = (base + offset + 360) % 360
    const saturation = Math.min(80, Math.max(28, saturations[index] + (Math.random() * 16 - 8)))
    const lightness = Math.min(92, Math.max(18, lightnesses[index] + (Math.random() * 10 - 5)))
    return hslToHex(hue, saturation, lightness)
  })
  return { colors, name: scheme.name }
}
