// Product catalog data
const products = [
  {
    id: "p1",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 199.99,
    oldPrice: 249.99,
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    badge: "popular",
    inStock: true,
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory-foam earcups. Perfect for travel, work, or immersive listening at home."
  },
  {
    id: "p2",
    name: "Minimalist Leather Watch",
    category: "Accessories",
    price: 129.00,
    oldPrice: null,
    rating: 4.6,
    reviews: 187,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format&fit=crop",
    badge: "new",
    inStock: true,
    description: "A timeless minimalist watch crafted from genuine Italian leather with a stainless steel case and sapphire crystal face. Slim profile, elegant for every occasion."
  },
  {
    id: "p3",
    name: "Smart Home Security Camera",
    category: "Electronics",
    price: 89.99,
    oldPrice: 109.99,
    rating: 4.4,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1558004993-cd3728573584?w=600&q=80&auto=format&fit=crop",
    badge: "sale",
    inStock: true,
    description: "1080p Wi-Fi security camera with night vision, two-way audio, motion detection, and instant mobile alerts. Easy DIY setup in minutes."
  },
  {
    id: "p4",
    name: "Organic Cotton T-Shirt",
    category: "Apparel",
    price: 34.00,
    oldPrice: null,
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "Soft, breathable organic cotton tee with a relaxed fit. Ethically made, pre-shrunk, and available in multiple colors. A wardrobe essential."
  },
  {
    id: "p5",
    name: "Stainless Steel Water Bottle",
    category: "Home",
    price: 42.00,
    oldPrice: null,
    rating: 4.7,
    reviews: 298,
    image: "https://images.unsplash.com/photo-1602142116771-2d66768be00e?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "Double-wall vacuum insulated bottle keeps drinks cold for 24h or hot for 12h. Leak-proof, BPA-free, powder-coated finish."
  },
  {
    id: "p6",
    name: "Mechanical Keyboard - RGB",
    category: "Electronics",
    price: 149.00,
    oldPrice: null,
    rating: 4.8,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b94a401?w=600&q=80&auto=format&fit=crop",
    badge: "new",
    inStock: true,
    description: "Hot-swappable mechanical keyboard with RGB backlighting, PBT keycaps, and responsive switches. Built for gamers and power users."
  },
  {
    id: "p7",
    name: "Wireless Charging Stand",
    category: "Electronics",
    price: 59.00,
    oldPrice: 79.00,
    rating: 4.5,
    reviews: 96,
    image: "https://images.unsplash.com/photo-1585929686498-9d91c8b40e4d?w=600&q=80&auto=format&fit=crop",
    badge: "sale",
    inStock: true,
    description: "15W fast wireless charging stand with an adjustable viewing angle. Qi-certified and compatible with all enabled smartphones."
  },
  {
    id: "p8",
    name: "Leather Tote Bag",
    category: "Accessories",
    price: 159.00,
    oldPrice: null,
    rating: 4.7,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: false,
    description: "Spacious full-grain leather tote with sturdy handles and interior pockets. Ages beautifully with everyday use."
  },
  {
    id: "p9",
    name: "Noise-Isolating Earbuds",
    category: "Electronics",
    price: 79.99,
    oldPrice: null,
    rating: 4.3,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12865e70e?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "True wireless earbuds with silicone tips for passive noise isolation, IPX4 water resistance, and 20-hour total playtime."
  },
  {
    id: "p10",
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 44.00,
    oldPrice: null,
    rating: 4.6,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "Set of four hand-glazed ceramic mugs, microwave and dishwasher safe. Minimalist design for your morning ritual."
  },
  {
    id: "p11",
    name: "4K Streaming Media Player",
    category: "Electronics",
    price: 69.00,
    oldPrice: null,
    rating: 4.4,
    reviews: 221,
    image: "https://images.unsplash.com/photo-1593357870181-57025658187f?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "Compact 4K HDR streaming player with voice remote, Dolby Vision, and access to all major streaming services."
  },
  {
    id: "p12",
    name: "Yoga Mat with Carry Strap",
    category: "Home",
    price: 38.00,
    oldPrice: null,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1544367567-0f28b003003b?w=600&q=80&auto=format&fit=crop",
    badge: null,
    inStock: true,
    description: "Non-slip, extra-thick TPE yoga mat with alignment guides and a reusable carry strap. Ideal for home practice."
  }
];

// Category list derived from products
const categories = Array.from(new Set(products.map(p => p.category)));

// Simple in-memory cart
let cart = JSON.parse(localStorage.getItem("capstone_cart")) || [];
function saveCart() { localStorage.setItem("capstone_cart", JSON.stringify(cart)); }

export { products, categories, cart, saveCart };
