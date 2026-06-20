import { Product } from "@/types";

export const products: Product[] = [
  // WATCHES
  {
    id: "prod_1",
    slug: "citizen-tsuyosa-automatic-yellow",
    name: "Citizen Tsuyosa Automatic Yellow Dial",
    category: "watches",
    collection: "automatic-elegance",
    description: "The Citizen Tsuyosa brings a vibrant splash of color to an elegant, integrated-bracelet sports watch design. Featuring a reliable automatic movement and a sapphire crystal, it perfectly balances modern aesthetics with traditional watchmaking.",
    shortDescription: "Vibrant yellow dial automatic watch with integrated bracelet.",
    images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop",
    price: 450,
    featured: true,
    specifications: [
      { name: "Movement", value: "Automatic Caliber 8210" },
      { name: "Case Size", value: "40mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Water Resistance", value: "50m" }
    ]
  },
  {
    id: "prod_2",
    slug: "seiko-presage-cocktail-time",
    name: "Seiko Presage Cocktail Time 'Blue Moon'",
    category: "watches",
    collection: "automatic-elegance",
    description: "Inspired by the glamour of the cocktail bar, this Seiko Presage features a mesmerizing sunray dial that catches the light beautifully. A true dress watch classic.",
    shortDescription: "Elegant dress watch with a captivating blue sunray dial.",
    images: ["https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop",
    price: 550,
    featured: false,
    specifications: [
      { name: "Movement", value: "Automatic 4R35" },
      { name: "Case Size", value: "40.5mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Glass", value: "Box-shaped Hardlex" }
    ]
  },
  {
    id: "prod_3",
    slug: "seiko-prospex-diver-turtle",
    name: "Seiko Prospex 'Turtle' Diver",
    category: "watches",
    collection: "diver-collection",
    description: "A legendary diver's watch known affectionately as the 'Turtle'. It offers robust construction, incredible luminescence, and professional-grade water resistance.",
    shortDescription: "Professional ISO-certified diver's watch.",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
    price: 625,
    featured: true,
    specifications: [
      { name: "Movement", value: "Automatic 4R36" },
      { name: "Case Size", value: "45mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Water Resistance", value: "200m ISO 6425" }
    ]
  },
  {
    id: "prod_4",
    slug: "bulova-lunar-pilot",
    name: "Bulova Lunar Pilot Chronograph",
    category: "watches",
    description: "An authentic replica of the chronograph worn on the moon during the Apollo 15 mission. Features a high-performance quartz movement for unparalleled accuracy.",
    shortDescription: "Historic chronograph with ultra-high frequency quartz movement.",
    images: ["https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?q=80&w=1000&auto=format&fit=crop",
    price: 795,
    featured: false,
    specifications: [
      { name: "Movement", value: "High Performance Quartz" },
      { name: "Case Size", value: "45mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Glass", value: "Sapphire Crystal" }
    ]
  },
  {
    id: "prod_5",
    slug: "steeldive-1970-willard",
    name: "Steeldive 1970 'Captain Willard' Homage",
    category: "watches",
    collection: "diver-collection",
    description: "A robust and highly capable tribute to the classic 1970s asymmetrical diver. Built with modern materials including a ceramic bezel and sapphire crystal.",
    shortDescription: "Tough, vintage-inspired dive watch with modern specs.",
    images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop",
    price: 250,
    featured: false,
    specifications: [
      { name: "Movement", value: "Automatic NH35" },
      { name: "Case Size", value: "44mm" },
      { name: "Bezel", value: "Ceramic Insert" },
      { name: "Water Resistance", value: "200m" }
    ]
  },
  {
    id: "prod_6",
    slug: "citizen-promaster-diver",
    name: "Citizen Eco-Drive Promaster Diver",
    category: "watches",
    collection: "diver-collection",
    description: "Powered by light, this Promaster diver never needs a battery change. A reliable, durable, and environmentally conscious tool watch.",
    shortDescription: "Solar-powered professional dive watch.",
    images: ["https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=1000&auto=format&fit=crop",
    price: 350,
    featured: false,
    specifications: [
      { name: "Movement", value: "Eco-Drive (Solar)" },
      { name: "Case Size", value: "44mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Water Resistance", value: "200m ISO" }
    ]
  },

  // JEWELRY
  {
    id: "prod_7",
    slug: "5mm-moissanite-tennis-chain",
    name: "5mm Moissanite Tennis Chain (White Gold)",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "A spectacular 5mm tennis chain featuring D-color, VVS clarity moissanite stones set in 14k white gold vermeil. Exhibits incredible fire and brilliance that rivals natural diamonds.",
    shortDescription: "Dazzling 5mm moissanite tennis chain in white gold finish.",
    images: ["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
    price: 850,
    featured: true,
    specifications: [
      { name: "Stone", value: "Moissanite (VVS1, D Color)" },
      { name: "Width", value: "5mm" },
      { name: "Material", value: "14k White Gold Vermeil over 925 Silver" },
      { name: "Setting", value: "4-Prong" }
    ]
  },
  {
    id: "prod_8",
    slug: "4mm-moissanite-tennis-bracelet",
    name: "4mm Moissanite Tennis Bracelet",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "The classic tennis bracelet elevated with flawless 4mm moissanite stones. A perfect everyday piece that catches light from every angle.",
    shortDescription: "Elegant and timeless 4mm moissanite tennis bracelet.",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
    price: 450,
    featured: true,
    specifications: [
      { name: "Stone", value: "Moissanite (VVS1, D Color)" },
      { name: "Width", value: "4mm" },
      { name: "Length", value: "7 inches / 8 inches" },
      { name: "Clasp", value: "Double Safety Box Clasp" }
    ]
  },
  {
    id: "prod_9",
    slug: "cuban-link-moissanite-clasp",
    name: "10mm Cuban Link Chain with Moissanite Clasp",
    category: "jewelry",
    description: "A heavy, solid Miami Cuban link chain boasting a custom-designed box clasp fully iced out with brilliant moissanite stones.",
    shortDescription: "Bold 10mm Cuban chain with an iced-out clasp.",
    images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop",
    price: 650,
    featured: false,
    specifications: [
      { name: "Chain Style", value: "Miami Cuban Link" },
      { name: "Width", value: "10mm" },
      { name: "Material", value: "18k Gold Plated Stainless Steel" },
      { name: "Clasp Stones", value: "Moissanite" }
    ]
  },
  {
    id: "prod_10",
    slug: "brilliant-cut-solitaire-ring",
    name: "2ct Brilliant Cut Moissanite Solitaire Ring",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "A breathtaking 2-carat round brilliant cut moissanite set in a classic 6-prong solitaire setting. A timeless symbol of love and elegance.",
    shortDescription: "Classic 2-carat moissanite engagement-style ring.",
    images: ["https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=1000&auto=format&fit=crop",
    price: 550,
    featured: true,
    specifications: [
      { name: "Center Stone", value: "2 Carat Moissanite" },
      { name: "Cut", value: "Round Brilliant" },
      { name: "Setting Material", value: "14k Solid White Gold" },
      { name: "Clarity", value: "VVS1" }
    ]
  },
  {
    id: "prod_11",
    slug: "mens-diamond-signet-ring",
    name: "Men's Moissanite Signet Ring",
    category: "jewelry",
    description: "A bold, modern take on the traditional signet ring. Features a brushed gold finish with a striking pavé moissanite center square.",
    shortDescription: "Heavy brushed gold signet ring with moissanite accents.",
    images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b4a?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1602173574767-37ac01994b4a?q=80&w=1000&auto=format&fit=crop",
    price: 420,
    featured: false,
    specifications: [
      { name: "Style", value: "Square Signet" },
      { name: "Material", value: "18k Yellow Gold Plated 925 Silver" },
      { name: "Stones", value: "Pavé Moissanite" },
      { name: "Weight", value: "14 grams" }
    ]
  },
  {
    id: "prod_12",
    slug: "vvs-moissanite-stud-earrings",
    name: "VVS Moissanite Stud Earrings (2ct tw)",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "The ultimate daily staple. These 1-carat each (2ct total weight) moissanite stud earrings offer incredible sparkle in a secure screw-back setting.",
    shortDescription: "Essential 2ct total weight moissanite stud earrings.",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"],
    featuredImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    price: 320,
    featured: false,
    specifications: [
      { name: "Stone Size", value: "1 Carat each (6.5mm)" },
      { name: "Total Carat Weight", value: "2.0 CTW" },
      { name: "Setting", value: "4-Prong Basket" },
      { name: "Backing", value: "Secure Screw-Back" }
    ]
  }
];
