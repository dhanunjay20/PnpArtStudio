// src/data/products.js

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} title
 * @property {number} price
 * @property {string} image
 * @property {string} category
 * @property {string} description
 * @property {string} dimensions
 * @property {string} medium
 * @property {number} year
 * @property {boolean} inStock
 * @property {boolean} featured
 * @property {string[]} images
 */

const y = new Date().getFullYear();

/** @type {Product[]} */
export const sampleProducts = [
  // Paintings (5)
  {
    id: "P-001",
    title: "Abstract Harmony",
    price: 450,
    image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Paintings",
    description: "A vibrant abstract composition exploring the relationship between color and form with a dynamic sense of motion.",
    dimensions: "24 x 18 inches",
    medium: "Acrylic on Canvas",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/1183021/pexels-photo-1183021.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "P-002",
    title: "Mountain Serenity",
    price: 680,
    image: "https://images.pexels.com/photos/1183021/pexels-photo-1183021.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Paintings",
    description: "A tranquil landscape capturing alpine light at dusk with soft edges and luminous glazes.",
    dimensions: "30 x 24 inches",
    medium: "Oil on Canvas",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1183021/pexels-photo-1183021.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "P-003",
    title: "Urban Dreams",
    price: 520,
    image: "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Paintings",
    description: "A contemporary city vignette with bold marks and mixed-media textures that echo the rhythm of urban life.",
    dimensions: "20 x 16 inches",
    medium: "Mixed Media on Canvas",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "P-004",
    title: "Floral Elegance",
    price: 380,
    image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Paintings",
    description: "A delicate bouquet rendered in translucent washes for a calm, airy presence.",
    dimensions: "18 x 14 inches",
    medium: "Watercolor on Paper",
    year: y - 1,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "P-005",
    title: "Ocean Waves",
    price: 590,
    image: "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Paintings",
    description: "A dynamic seascape capturing crest and foam with layered impasto and cool tonal balance.",
    dimensions: "28 x 22 inches",
    medium: "Oil on Canvas",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Return Gifts (5)
  {
    id: "RG-001",
    title: "Handcrafted Art Box",
    price: 75,
    image: "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Return Gifts",
    description: "A wooden keepsake box with a miniature hand-painted motif—perfect for gifting.",
    dimensions: "8 x 6 x 3 inches",
    medium: "Wood and Acrylic",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "RG-002",
    title: "Mini Canvas Magnet Set",
    price: 35,
    image: "https://images.pexels.com/photos/1111318/pexels-photo-1111318.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Return Gifts",
    description: "A set of mini canvas magnets featuring abstract micro‑paintings.",
    dimensions: "2 x 2 inches (each)",
    medium: "Acrylic on Mini Canvas",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1111318/pexels-photo-1111318.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "RG-003",
    title: "Art Bookmark Duo",
    price: 18,
    image: "https://images.pexels.com/photos/1334602/pexels-photo-1334602.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Return Gifts",
    description: "Two laminated bookmarks with archival art prints, satin tassel included.",
    dimensions: "6 x 2 inches (each)",
    medium: "Printed on Archival Card",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1334602/pexels-photo-1334602.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "RG-004",
    title: "Coaster Quartet",
    price: 28,
    image: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Return Gifts",
    description: "Set of 4 art‑print coasters with protective varnish.",
    dimensions: "4 x 4 inches (each)",
    medium: "MDF + Printed Laminate",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "RG-005",
    title: "Mini Framed Print",
    price: 40,
    image: "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Return Gifts",
    description: "A small framed art print—ready to gift.",
    dimensions: "5 x 7 inches (frame)",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Workshops (5)
  {
    id: "WS-001",
    title: "Beginner Acrylics",
    price: 120,
    image: "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Workshops",
    description: "A 3‑hour hands‑on starter to brushes, color mixing, and composition. All materials included.",
    dimensions: "3 hours",
    medium: "Workshop",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "WS-002",
    title: "Watercolor Botanicals",
    price: 140,
    image: "https://images.pexels.com/photos/2126549/pexels-photo-2126549.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Workshops",
    description: "Paint botanical studies with wet‑on‑wet and glazing techniques.",
    dimensions: "3.5 hours",
    medium: "Workshop",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/2126549/pexels-photo-2126549.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "WS-003",
    title: "Palette Knife Landscapes",
    price: 160,
    image: "https://images.pexels.com/photos/3736059/pexels-photo-3736059.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Workshops",
    description: "Learn texture, impasto, and expressive knife work for bold landscapes.",
    dimensions: "4 hours",
    medium: "Workshop",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/3736059/pexels-photo-3736059.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "WS-004",
    title: "Color Theory in Practice",
    price: 110,
    image: "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Workshops",
    description: "Hands‑on mixing, complements, temperature, and limited palettes.",
    dimensions: "3 hours",
    medium: "Workshop",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "WS-005",
    title: "Figure & Gesture (Intro)",
    price: 170,
    image: "https://images.pexels.com/photos/461077/pexels-photo-461077.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Workshops",
    description: "Gesture, proportion, and rhythm—charcoal and ink studies for beginners.",
    dimensions: "4 hours",
    medium: "Workshop",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/461077/pexels-photo-461077.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Custom Orders (5)
  {
    id: "CO-001",
    title: "Custom Portrait (Single)",
    price: 800,
    image: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Custom Orders",
    description: "Commission a portrait from a photo—archival oils or acrylics; progress updates included.",
    dimensions: "16 x 12 inches (base size)",
    medium: "Oil or Acrylic on Canvas",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "CO-002",
    title: "Couple Portrait",
    price: 1200,
    image: "https://images.pexels.com/photos/1391581/pexels-photo-1391581.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Custom Orders",
    description: "A tailored two‑subject portrait with composition planning and color styling.",
    dimensions: "20 x 16 inches (base size)",
    medium: "Oil or Acrylic on Canvas",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1391581/pexels-photo-1391581.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "CO-003",
    title: "Pet Portrait",
    price: 450,
    image: "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Custom Orders",
    description: "Capture a pet’s character with layered brushwork and expressive detail.",
    dimensions: "12 x 12 inches (base size)",
    medium: "Oil or Acrylic on Canvas",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/774731/pexels-photo-774731.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "CO-004",
    title: "Custom Landscape",
    price: 950,
    image: "https://images.pexels.com/photos/207049/pexels-photo-207049.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Custom Orders",
    description: "Commission a landscape based on your reference—mood, season, and palette tailored.",
    dimensions: "24 x 18 inches (base size)",
    medium: "Oil on Canvas",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/207049/pexels-photo-207049.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "CO-005",
    title: "Abstract Statement Piece",
    price: 1500,
    image: "https://images.pexels.com/photos/1109352/pexels-photo-1109352.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Custom Orders",
    description: "A large‑scale abstract center‑piece informed by your space and palette.",
    dimensions: "36 x 36 inches (customizable)",
    medium: "Acrylic on Canvas",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1109352/pexels-photo-1109352.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Digital Prints (5)
  {
    id: "DP-001",
    title: "Abstract Harmony (Print)",
    price: 60,
    image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Digital Prints",
    description: "Archival giclée print of 'Abstract Harmony' on cotton rag paper.",
    dimensions: "12 x 12 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "DP-002",
    title: "Seaside Rhythm (Print)",
    price: 55,
    image: "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Digital Prints",
    description: "High‑fidelity print capturing subtle tonal shifts of ocean spray.",
    dimensions: "11 x 14 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "DP-003",
    title: "Floral Study No.3 (Print)",
    price: 45,
    image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Digital Prints",
    description: "Soft watercolor blooms reproduced with archival inks.",
    dimensions: "12 x 16 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "DP-004",
    title: "City Lights (Print)",
    price: 50,
    image: "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Digital Prints",
    description: "A vivid urban scene reproduced on premium matte stock.",
    dimensions: "12 x 18 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "DP-005",
    title: "Calm Garden (Print)",
    price: 42,
    image: "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Digital Prints",
    description: "A soothing botanical arrangement ideal for bedroom walls.",
    dimensions: "10 x 12 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Handcrafted Items (5)
  {
    id: "HI-001",
    title: "Hand‑Thrown Vase",
    price: 95,
    image: "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Handcrafted Items",
    description: "Stoneware vase with subtle glaze and hand‑painted motif.",
    dimensions: "9 x 4 inches",
    medium: "Ceramic",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "HI-002",
    title: "Painted Trinket Dish",
    price: 28,
    image: "https://images.pexels.com/photos/5699664/pexels-photo-5699664.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Handcrafted Items",
    description: "Small dish with hand‑painted abstract petals; sealed for durability.",
    dimensions: "4.5 inches diameter",
    medium: "Ceramic + Acrylic",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/5699664/pexels-photo-5699664.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "HI-003",
    title: "Textured Canvas Journal",
    price: 35,
    image: "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Handcrafted Items",
    description: "Hardcover journal wrapped in painted canvas with waxed thread binding.",
    dimensions: "A5",
    medium: "Mixed Materials",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "HI-004",
    title: "Art Tile (Set of 2)",
    price: 48,
    image: "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Handcrafted Items",
    description: "Two small art tiles with satin finish—usable as trivets or decor.",
    dimensions: "4 x 4 inches (each)",
    medium: "Ceramic Tile + Varnish",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "HI-005",
    title: "Hand‑Painted Frame",
    price: 55,
    image: "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Handcrafted Items",
    description: "Wooden frame with layered abstract strokes; holds 5x7 artwork.",
    dimensions: "8 x 10 inches (frame)",
    medium: "Wood + Acrylic",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },

  // Limited Editions (5)
  {
    id: "LE-001",
    title: "Limited Edition: Aurora",
    price: 220,
    image: "https://images.pexels.com/photos/1727653/pexels-photo-1727653.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Limited Editions",
    description: "Signed and numbered edition (1/100) with certificate of authenticity.",
    dimensions: "16 x 12 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1727653/pexels-photo-1727653.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "LE-002",
    title: "Limited Edition: Nightfall",
    price: 240,
    image: "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Limited Editions",
    description: "Dark, moody skyline—edition of 75, hand‑signed.",
    dimensions: "18 x 12 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "LE-003",
    title: "Limited Edition: Sea Glass",
    price: 210,
    image: "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Limited Editions",
    description: "Cool tonal palette—edition of 100 with deckled edge.",
    dimensions: "14 x 14 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "LE-004",
    title: "Limited Edition: Blossom",
    price: 200,
    image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Limited Editions",
    description: "Soft botanical edition of 100; numbered and signed.",
    dimensions: "12 x 16 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: false,
    images: [
      "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  },
  {
    id: "LE-005",
    title: "Limited Edition: Radiance",
    price: 230,
    image: "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    category: "Limited Editions",
    description: "Warm abstract edition of 75—COA included.",
    dimensions: "16 x 12 inches",
    medium: "Giclée Print",
    year: y,
    inStock: true,
    featured: true,
    images: [
      "https://images.pexels.com/photos/1858406/pexels-photo-1858406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
    ]
  }
];

/**
 * @param {string} id
 * @returns {Product | undefined}
 */
export const getProductById = (id) => {
  return sampleProducts.find((p) => p.id === id);
};

/**
 * @param {string} category - slug (e.g., "handcrafted-items") or "all-products"
 * @returns {Product[]}
 */
export const getProductsByCategory = (category) => {
  if (category === "all-products") return sampleProducts;
  const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");
  return sampleProducts.filter((p) => slug(p.category) === category);
};

/** @returns {Product[]} */
export const getFeaturedProducts = () => {
  return sampleProducts.filter((p) => p.featured);
};
