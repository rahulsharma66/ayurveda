export interface Product {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  benefits: string[];
  ingredients?: string[];
  usage?: string[];
  variants: {
    size: string;
    mrp: number;
    salePrice: number;
  }[];
  category: string;
  image: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "chyawanprash",
    name: "Chyawanprash – 48+ Herbs Ayurvedic Formula",
    shortName: "Chyawanprash",
    description: "Traditional immunity-boosting Ayurvedic formulation with 48+ potent herbs",
    longDescription: "Our Chyawanprash is a time-tested Ayurvedic rasayana prepared with over 48 herbs following ancient Vedic traditions. This powerful rejuvenating formula strengthens immunity, enhances vitality, and promotes overall wellness.",
    benefits: [
      "Immunity booster – strengthens natural defense",
      "Rejuvenating (Rasayana) – promotes longevity",
      "Improves digestion & metabolism",
      "Enhances energy & stamina",
      "Supports respiratory health",
      "Rich in antioxidants & Vitamin C"
    ],
    ingredients: ["Amla", "Ashwagandha", "Shatavari", "Pippali", "Giloy", "Brahmi", "48+ traditional herbs"],
    usage: ["Take 1-2 teaspoons daily", "Best consumed with warm milk", "Suitable for all ages above 5 years"],
    variants: [
      { size: "500g", mrp: 1200, salePrice: 1080 }
    ],
    category: "Immunity",
    image: "/products/chyawanprash.jpg",
    featured: true
  },
  {
    id: "shat-dhaut-ghrita",
    name: "Shat Dhaut Ghrita – 100 Times Washed Ghee",
    shortName: "Shat Dhaut Ghrita",
    description: "Ancient Ayurvedic skin remedy – ghee washed 100 times for healing properties",
    longDescription: "Shat Dhaut Ghrita is a legendary Ayurvedic preparation where pure cow ghee is washed 100 times with water, transforming it into a light, cooling cream. This ancient remedy is revered for its exceptional healing and anti-aging properties.",
    benefits: [
      "Heals sunburns & skin irritation",
      "Effective for psoriasis & eczema",
      "Powerful anti-aging properties",
      "Reduces dark circles & pigmentation",
      "Deeply moisturizes dry skin",
      "Soothes burns and wounds"
    ],
    usage: ["Apply thin layer on affected area", "Use at night for best results", "Safe for sensitive skin"],
    variants: [
      { size: "35ml", mrp: 600, salePrice: 600 }
    ],
    category: "Skin Care",
    image: "/products/ghrita.jpg",
    featured: true
  },
  {
    id: "herbal-shampoo",
    name: "Herbal Shampoo – SLS & Paraben Free",
    shortName: "Herbal Shampoo",
    description: "Pure Ayurvedic hair cleanser with Amla, Shikakai & natural herbs",
    longDescription: "Our Herbal Shampoo is a gentle, chemical-free formulation crafted with traditional Ayurvedic herbs. Free from SLS, parabens, and harmful chemicals, it cleanses naturally while nourishing your scalp and hair.",
    benefits: [
      "100% SLS & Paraben free",
      "Prevents hair fall naturally",
      "Controls premature greying",
      "Promotes healthy hair growth",
      "Removes dandruff gently",
      "Adds natural shine & softness"
    ],
    ingredients: ["Amla (Indian Gooseberry)", "Shikakai", "Reetha", "Bhringraj", "Neem", "Brahmi"],
    usage: ["Wet hair thoroughly", "Apply and massage gently", "Rinse with water", "Use 2-3 times weekly"],
    variants: [
      { size: "200ml", mrp: 250, salePrice: 250 }
    ],
    category: "Hair Care",
    image: "/products/shampoo.jpg",
    featured: true
  },
  {
    id: "herbal-soap-kesuda",
    name: "Herbal Soap – Palash (Kesuda) Flower",
    shortName: "Kesuda Soap",
    description: "Traditional Ayurvedic soap with sacred Palash flower extracts",
    longDescription: "Crafted with the sacred Palash (Kesuda) flower, this Ayurvedic soap offers gentle cleansing with natural antiseptic properties. The Palash flower has been used in Ayurveda for centuries for its skin-purifying benefits.",
    benefits: [
      "Natural antiseptic properties",
      "Gentle on sensitive skin",
      "Improves skin complexion",
      "Chemical-free cleansing",
      "Traditional Ayurvedic formula"
    ],
    ingredients: ["Palash (Kesuda) flower extract", "Coconut oil", "Natural glycerin"],
    variants: [
      { size: "60gm", mrp: 70, salePrice: 70 },
      { size: "100gm", mrp: 100, salePrice: 100 }
    ],
    category: "Body Care",
    image: "/products/kesuda-soap.jpg",
    featured: false
  },
  {
    id: "herbal-soap-neem",
    name: "Herbal Soap – Neem, Tulsi & Aloe Vera",
    shortName: "Neem-Tulsi Soap",
    description: "Triple-action Ayurvedic soap with Neem, Tulsi & Aloe Vera",
    longDescription: "A powerful combination of three Ayurvedic powerhouses – Neem, Tulsi, and Aloe Vera. This soap provides deep cleansing, antibacterial protection, and natural hydration for healthy, glowing skin.",
    benefits: [
      "Antibacterial & antifungal",
      "Deep cleanses pores",
      "Natural skin hydration",
      "Controls acne & pimples",
      "Soothes skin irritation",
      "Suitable for all skin types"
    ],
    ingredients: ["Neem extract", "Tulsi (Holy Basil)", "Aloe Vera gel", "Natural oils"],
    variants: [
      { size: "60gm", mrp: 60, salePrice: 60 },
      { size: "100gm", mrp: 90, salePrice: 90 }
    ],
    category: "Body Care",
    image: "/products/neem-soap.jpg",
    featured: false
  }
];

export const categories = ["All", "Immunity", "Skin Care", "Hair Care", "Body Care"];
