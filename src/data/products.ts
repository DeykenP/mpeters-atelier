import { Product } from "@/types";

export const products: Product[] = [
  // WATCHES
  {
    id: "prod_1",
    slug: "citizen-tsuyosa-automatic-tiffany",
    name: "Citizen Tsuyosa Automatic Tiffany Blue Dial",
    category: "watches",
    collection: "automatic-elegance",
    description: "The Citizen Tsuyosa in the highly coveted Tiffany Blue dialect. It seamlessly combines a vibrant, eye-catching face with a meticulously brushed integrated bracelet. Powered by a robust automatic movement, it is a masterclass in modern sports elegance.",
    shortDescription: "Iconic Tiffany Blue dial automatic watch with integrated bracelet.",
    images: ["/images/products/watches/citizen-tsuyosa-automatic-tiffany-1.jpeg"],
    featuredImage: "/images/products/watches/citizen-tsuyosa-automatic-tiffany-1.jpeg",
    price: 495,
    featured: true,
    specifications: [
      { name: "Movement", value: "Automatic Caliber 8210" },
      { name: "Case Size", value: "40mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Crystal", value: "Sapphire" }
    ]
  },
  {
    id: "prod_2",
    slug: "citizen-tsuyosa-automatic-green",
    name: "Citizen Tsuyosa Automatic Green Dial",
    category: "watches",
    collection: "automatic-elegance",
    description: "A rich, deep green sunray dial elevates this variation of the Citizen Tsuyosa. With its polished bezel and seamlessly integrated bracelet, it offers an undeniable presence on the wrist. Exceptional automatic reliability matched with sophisticated aesthetics.",
    shortDescription: "Sophisticated deep green dial automatic watch with integrated bracelet.",
    images: ["/images/products/watches/citizen-tsuyosa-automatic-green-1.jpeg"],
    featuredImage: "/images/products/watches/citizen-tsuyosa-automatic-green-1.jpeg",
    price: 450,
    featured: true,
    specifications: [
      { name: "Movement", value: "Automatic Caliber 8210" },
      { name: "Case Size", value: "40mm" },
      { name: "Material", value: "Stainless Steel" },
      { name: "Crystal", value: "Sapphire" }
    ]
  },

  
  // JEWELRY
  {
    id: "prod_4",
    slug: "5mm-moissanite-tennis-chain",
    name: "5mm Moissanite Tennis Chain (White Gold)",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "A spectacular 5mm tennis chain featuring D-color, VVS clarity moissanite stones set in 14k white gold vermeil. Exhibits incredible fire and brilliance that rivals natural diamonds.",
    shortDescription: "Dazzling 5mm moissanite tennis chain in white gold finish.",
    images: ["/images/products/jewelry/5mm-moissanite-tennis-chain-1.jpeg"],
    featuredImage: "/images/products/jewelry/5mm-moissanite-tennis-chain-1.jpeg",
    price: 850,
    featured: false,
    specifications: [
      { name: "Stone", value: "VVS Moissanite (D Color)" },
      { name: "Size", value: "5mm Width" },
      { name: "Material", value: "14k White Gold Vermeil over 925 Sterling Silver" },
      { name: "Setting", value: "4-Prong Hand Set" }
    ]
  },
  {
    id: "prod_5",
    slug: "4mm-moissanite-tennis-bracelet",
    name: "4mm Moissanite Tennis Bracelet",
    category: "jewelry",
    collection: "diamond-essentials",
    description: "Elegant and versatile, this 4mm moissanite tennis bracelet features perfectly matched stones that capture the light from every angle. Secured with a premium double-latch box clasp.",
    shortDescription: "Elegant 4mm moissanite tennis bracelet with double-latch clasp.",
    images: ["/images/products/jewelry/4mm-moissanite-tennis-bracelet-1.jpg"],
    featuredImage: "/images/products/jewelry/4mm-moissanite-tennis-bracelet-1.jpg",
    price: 450,
    featured: false,
    specifications: [
      { name: "Stone", value: "VVS Moissanite (D Color)" },
      { name: "Size", value: "4mm Width" },
      { name: "Material", value: "14k White Gold Vermeil over 925 Sterling Silver" },
      { name: "Clasp", value: "Double-Latch Box Clasp" }
    ]
  }
];
