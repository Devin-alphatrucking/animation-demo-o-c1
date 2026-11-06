/**
 * OM Telecom catalogue — static, typed data. Edit this file to change what the site shows.
 * DEMO DATA: model names are real launches, but prices are illustrative samples, and the
 * highlights are short marketing summaries. Confirm every price and spec before publishing
 * (set `DEMO_CATALOGUE` to false in src/data/site.ts once they are real).
 */
import type { DeviceKind } from "@/data/types";

export const BRANDS: { name: string; tagline: string; accent: string; featured?: boolean }[] = [
  { name: "Apple", tagline: "iPhone, iPad, Mac, Watch and AirPods.", accent: "#1d1d1f", featured: true },
  { name: "Samsung", tagline: "Galaxy smartphones, tablets, wearables and TVs.", accent: "#1428a0", featured: true },
  { name: "Vivo", tagline: "Camera-focused smartphones for every budget.", accent: "#415fff", featured: true },
  { name: "Oppo", tagline: "Stylish Reno and F series smartphones.", accent: "#2d683d", featured: true },
  { name: "OnePlus", tagline: "Fast, smooth flagship and Nord phones.", accent: "#eb0028", featured: true },
  { name: "Xiaomi", tagline: "Xiaomi and Redmi phones, tablets and smart devices.", accent: "#ff6900", featured: true },
  { name: "Realme", tagline: "Performance-packed phones for young India.", accent: "#d4a900", featured: true },
  { name: "Motorola", tagline: "Clean Android with Edge and G series phones.", accent: "#001428", featured: true },
  { name: "Nothing", tagline: "Transparent design, Glyph interface.", accent: "#000000", featured: true },
  { name: "iQOO", tagline: "Gaming-grade performance smartphones.", accent: "#ffcc00", featured: true },
  { name: "Google", tagline: "Pixel phones with Google AI built in.", accent: "#4285f4", featured: true },
  { name: "Lenovo", tagline: "Laptops and tablets for work and study.", accent: "#e2231a" },
  { name: "HP", tagline: "Everyday and convertible laptops.", accent: "#0096d6" },
  { name: "ASUS", tagline: "Vivobook and gaming laptops.", accent: "#00539b" },
  { name: "Sony", tagline: "Audio, BRAVIA TVs and PlayStation accessories.", accent: "#000000" },
  { name: "JBL", tagline: "Headphones and portable speakers.", accent: "#ff3300" },
  { name: "boAt", tagline: "Everyday audio and wearables.", accent: "#e1251b" },
];

export const CATEGORIES: { name: string; kind: DeviceKind; navGroup: string; description: string }[] = [
  { name: "Smartphones", kind: "PHONE", navGroup: "mobiles", description: "5G smartphones from Apple, Samsung, OnePlus, Vivo, Oppo and more." },
  { name: "Tablets", kind: "TABLET", navGroup: "tablets", description: "iPad and Android tablets for study, work and entertainment." },
  { name: "Laptops", kind: "LAPTOP", navGroup: "laptops", description: "Thin-and-light, convertible and performance laptops." },
  { name: "Smartwatches", kind: "WATCH", navGroup: "smartwatches", description: "Smartwatches and fitness wearables." },
  { name: "Earbuds", kind: "EARBUDS", navGroup: "accessories", description: "True wireless earbuds with noise cancellation." },
  { name: "Headphones", kind: "HEADPHONES", navGroup: "accessories", description: "Over-ear and on-ear wireless headphones." },
  { name: "Chargers", kind: "CHARGER", navGroup: "accessories", description: "Fast chargers and power adapters." },
  { name: "Cables", kind: "CABLE", navGroup: "accessories", description: "USB-C, Lightning and charging cables." },
  { name: "Power Banks", kind: "POWERBANK", navGroup: "accessories", description: "Portable power banks for phones and laptops." },
  { name: "Mobile Accessories", kind: "ACCESSORY", navGroup: "accessories", description: "Cases, screen protection and more." },
  { name: "Smart TVs", kind: "TV", navGroup: "electronics", description: "4K and smart televisions." },
  { name: "Home Electronics", kind: "HOME", navGroup: "electronics", description: "Speakers and smart home devices." },
  { name: "Gaming Accessories", kind: "GAMING", navGroup: "electronics", description: "Controllers and gaming gear." },
];

export type V = { storage?: string; color: string; hex: string; price: number; mrp: number };
export type P = {
  name: string;
  brand: string;
  category: string;
  short: string;
  highlights: string[];
  specs?: { group: string; items: [string, string][] }[];
  variants: V[];
  flags?: ("trending" | "bestseller" | "new")[];
  labels?: string[];
  launch?: string;
};

const c = (color: string, hex: string) => ({ color, hex });
const vv = (colors: { color: string; hex: string }[], tiers: [string | undefined, number, number][]): V[] =>
  tiers.flatMap(([storage, price, mrp]) => colors.map((col) => ({ storage, color: col.color, hex: col.hex, price, mrp })));

export const PRODUCTS: P[] = [
  // Smartphones
  { name: "iPhone 17 Pro", brand: "Apple", category: "Smartphones", short: "Pro camera system and Apple silicon in an aluminium design.", highlights: ["Triple 48MP Pro camera system", "ProMotion display", "USB-C"], variants: vv([c("Cosmic Orange", "#f07a2a"), c("Deep Blue", "#2b3a55"), c("Silver", "#e3e4e5")], [["256 GB", 134900, 134900], ["512 GB", 154900, 154900]]), flags: ["trending", "new"], labels: ["New launch"], launch: "2025-09-19" },
  { name: "iPhone 17", brand: "Apple", category: "Smartphones", short: "The everyday iPhone with a bigger, smoother display.", highlights: ["ProMotion up to 120Hz", "48MP Fusion camera", "Ceramic Shield"], variants: vv([c("Lavender", "#c9b8e8"), c("Mist Blue", "#a9c2d9"), c("Black", "#1f1f1f")], [["256 GB", 82900, 82900], ["512 GB", 102900, 102900]]), flags: ["trending", "bestseller", "new"], launch: "2025-09-19" },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Smartphones", short: "Galaxy AI flagship with built-in S Pen and 200MP camera.", highlights: ["200MP wide camera", "Built-in S Pen", "Titanium frame"], variants: vv([c("Titanium Silverblue", "#9fb3c8"), c("Titanium Black", "#2b2b2b")], [["12 GB / 256 GB", 119999, 129999], ["12 GB / 512 GB", 131999, 141999]]), flags: ["trending", "bestseller"], labels: ["Bank offer"] },
  { name: "Samsung Galaxy S25", brand: "Samsung", category: "Smartphones", short: "Compact Galaxy AI flagship.", highlights: ["Compact 6.2-inch display", "Galaxy AI", "50MP triple camera"], variants: vv([c("Icyblue", "#bcd6e6"), c("Navy", "#1e2b4a")], [["12 GB / 128 GB", 74999, 80999], ["12 GB / 256 GB", 80999, 86999]]), flags: ["bestseller"] },
  { name: "Samsung Galaxy A56 5G", brand: "Samsung", category: "Smartphones", short: "Premium mid-range Galaxy with long software support.", highlights: ["Super AMOLED 120Hz", "IP67", "45W charging"], variants: vv([c("Awesome Graphite", "#3a3a3a"), c("Awesome Olive", "#a2a77f")], [["8 GB / 128 GB", 38999, 44999], ["8 GB / 256 GB", 41999, 47999]]), flags: ["bestseller"] },
  { name: "Samsung Galaxy Z Fold7", brand: "Samsung", category: "Smartphones", short: "Thin foldable with a large inner screen.", highlights: ["Foldable 8-inch display", "200MP camera", "Galaxy AI"], variants: vv([c("Blue Shadow", "#3d4f6b"), c("Jetblack", "#111111")], [["12 GB / 256 GB", 174999, 186999]]), flags: ["new"], labels: ["New launch"], launch: "2025-07-25" },
  { name: "vivo V60 5G", brand: "Vivo", category: "Smartphones", short: "Slim portrait-camera phone with ZEISS optics.", highlights: ["ZEISS co-engineered cameras", "Curved AMOLED display", "Large battery"], variants: vv([c("Mist Grey", "#a7a9ac"), c("Moonlit Blue", "#5b7ba6")], [["8 GB / 128 GB", 36999, 42999], ["12 GB / 256 GB", 42999, 48999]]), flags: ["trending"] },
  { name: "vivo X200 Pro", brand: "Vivo", category: "Smartphones", short: "Flagship camera phone with a periscope telephoto.", highlights: ["200MP telephoto", "ZEISS optics", "Flagship chipset"], variants: vv([c("Titanium Grey", "#7d7f82"), c("Cosmos Black", "#1b1b1b")], [["16 GB / 512 GB", 94999, 99999]]) },
  { name: "OPPO Reno14 Pro 5G", brand: "Oppo", category: "Smartphones", short: "Portrait specialist with AI editing tools.", highlights: ["50MP telephoto portrait", "AI editing", "IP69 rating"], variants: vv([c("Pearl White", "#f2f0ec"), c("Titanium Grey", "#6e6f72")], [["12 GB / 256 GB", 49999, 54999], ["12 GB / 512 GB", 54999, 59999]]), flags: ["trending"] },
  { name: "OPPO F31 Pro 5G", brand: "Oppo", category: "Smartphones", short: "Durable all-rounder with a big battery.", highlights: ["Military-grade durability", "Large battery", "80W charging"], variants: vv([c("Desert Gold", "#c8a46b"), c("Space Grey", "#4b4d50")], [["8 GB / 128 GB", 26999, 30999], ["12 GB / 256 GB", 29999, 33999]]) },
  { name: "OnePlus 13", brand: "OnePlus", category: "Smartphones", short: "Hasselblad camera flagship with fast charging.", highlights: ["Hasselblad cameras", "100W SUPERVOOC", "2K ProXDR display"], variants: vv([c("Midnight Ocean", "#1d2b44"), c("Black Eclipse", "#151515")], [["12 GB / 256 GB", 69999, 72999], ["16 GB / 512 GB", 76999, 79999]]), flags: ["trending", "bestseller"] },
  { name: "OnePlus Nord 5", brand: "OnePlus", category: "Smartphones", short: "Fast Nord with a smooth 144Hz display.", highlights: ["144Hz AMOLED", "Big battery", "80W charging"], variants: vv([c("Marble Sands", "#d9cdb8"), c("Phantom Grey", "#4a4c50")], [["8 GB / 256 GB", 31999, 33999], ["12 GB / 512 GB", 37999, 39999]]), flags: ["bestseller"] },
  { name: "Xiaomi 15", brand: "Xiaomi", category: "Smartphones", short: "Compact Leica-tuned flagship.", highlights: ["Leica optics", "Compact flagship", "Fast charging"], variants: vv([c("Green", "#7c9b7e"), c("White", "#f3f3f1")], [["12 GB / 512 GB", 64999, 69999]]) },
  { name: "Redmi Note 14 Pro+ 5G", brand: "Xiaomi", category: "Smartphones", short: "Feature-rich Redmi with a 200MP camera.", highlights: ["200MP camera", "IP68", "120W HyperCharge"], variants: vv([c("Titan Black", "#202020"), c("Spectre Blue", "#5c7bb5")], [["8 GB / 256 GB", 29999, 34999], ["12 GB / 512 GB", 34999, 39999]]), flags: ["bestseller"] },
  { name: "realme GT 7", brand: "Realme", category: "Smartphones", short: "Performance flagship-killer.", highlights: ["Flagship-class chipset", "Large battery", "120W charging"], variants: vv([c("IceSense Blue", "#5e8fd6"), c("IceSense Black", "#1c1c1c")], [["8 GB / 256 GB", 39999, 44999], ["12 GB / 256 GB", 42999, 47999]]), flags: ["trending"] },
  { name: "realme P3 Pro 5G", brand: "Realme", category: "Smartphones", short: "Value 5G phone with a quad-curved display.", highlights: ["Quad-curved AMOLED", "IP69", "80W charging"], variants: vv([c("Nebula Glow", "#6f6bd1"), c("Saturn Brown", "#7d5a43")], [["8 GB / 128 GB", 21999, 25999], ["8 GB / 256 GB", 23999, 27999]]) },
  { name: "Motorola Edge 60 Pro", brand: "Motorola", category: "Smartphones", short: "Pantone-curated colours with a curved pOLED display.", highlights: ["Curved pOLED", "IP68/IP69", "68W TurboPower"], variants: vv([c("Pantone Shadow", "#2f3a3a"), c("Pantone Dazzling Blue", "#244c9a")], [["8 GB / 256 GB", 29999, 33999], ["12 GB / 256 GB", 33999, 37999]]), flags: ["trending"] },
  { name: "moto g96 5G", brand: "Motorola", category: "Smartphones", short: "Smooth everyday 5G phone.", highlights: ["144Hz pOLED", "Sony camera sensor", "Clean Android"], variants: vv([c("Ashleigh Blue", "#3f6f9f"), c("Cattleya Orchid", "#a17cb5")], [["8 GB / 128 GB", 17999, 19999], ["8 GB / 256 GB", 19999, 21999]]) },
  { name: "Nothing Phone (3)", brand: "Nothing", category: "Smartphones", short: "Nothing's flagship with the Glyph Matrix.", highlights: ["Glyph Matrix", "Flagship cameras", "Nothing OS"], variants: vv([c("White", "#f1f1f1"), c("Black", "#121212")], [["12 GB / 256 GB", 79999, 79999], ["16 GB / 512 GB", 89999, 89999]]), flags: ["new"], labels: ["New launch"], launch: "2025-07-15" },
  { name: "Nothing Phone (3a)", brand: "Nothing", category: "Smartphones", short: "Distinctive design with a telephoto camera.", highlights: ["Glyph interface", "Telephoto camera", "Nothing OS"], variants: vv([c("White", "#f1f1f1"), c("Black", "#121212"), c("Blue", "#8fb2d9")], [["8 GB / 128 GB", 24999, 27999], ["8 GB / 256 GB", 26999, 29999]]), flags: ["bestseller"] },
  { name: "iQOO 13 5G", brand: "iQOO", category: "Smartphones", short: "Gaming flagship with a dedicated gaming chip.", highlights: ["Snapdragon flagship chipset", "144Hz display", "120W FlashCharge"], variants: vv([c("Legend", "#f2f2f2"), c("Nardo Grey", "#5b5d60")], [["12 GB / 256 GB", 54999, 59999], ["16 GB / 512 GB", 59999, 64999]]) },
  { name: "iQOO Neo 10", brand: "iQOO", category: "Smartphones", short: "High frame-rate gaming on a budget.", highlights: ["144fps gaming", "Large battery", "120W charging"], variants: vv([c("Inferno Red", "#c43b2f"), c("Titanium Chrome", "#b9bcc0")], [["8 GB / 128 GB", 31999, 35999], ["12 GB / 256 GB", 35999, 39999]]), flags: ["trending"] },
  { name: "Google Pixel 10 Pro", brand: "Google", category: "Smartphones", short: "Pixel camera and Gemini built in.", highlights: ["Pixel camera with Pro zoom", "Gemini AI", "7 years of updates"], variants: vv([c("Moonstone", "#7d8a99"), c("Obsidian", "#202124")], [["16 GB / 256 GB", 109999, 109999]]), flags: ["new"], labels: ["New launch"], launch: "2025-08-28" },
  { name: "Google Pixel 9a", brand: "Google", category: "Smartphones", short: "Pixel essentials at a lower price.", highlights: ["Pixel camera", "Gemini AI", "Long software support"], variants: vv([c("Iris", "#8d8fd6"), c("Obsidian", "#202124")], [["8 GB / 256 GB", 49999, 52999]]) },
  // Tablets
  { name: "iPad Air 11-inch (M3)", brand: "Apple", category: "Tablets", short: "Thin, light and powerful with the M3 chip.", highlights: ["Apple M3 chip", "Liquid Retina display", "Apple Pencil Pro support"], variants: vv([c("Space Grey", "#5e5f62"), c("Blue", "#a6bcd3")], [["128 GB Wi-Fi", 59900, 59900], ["256 GB Wi-Fi", 69900, 69900]]), flags: ["bestseller"] },
  { name: "Samsung Galaxy Tab S10 FE", brand: "Samsung", category: "Tablets", short: "S Pen included, IP68 tablet.", highlights: ["S Pen in the box", "IP68", "Galaxy AI"], variants: vv([c("Gray", "#7a7c80"), c("Blue", "#9cb7d4")], [["8 GB / 128 GB Wi-Fi", 42999, 46999]]) },
  { name: "OnePlus Pad 3", brand: "OnePlus", category: "Tablets", short: "Large 3.4K display for work and play.", highlights: ["3.4K 144Hz display", "Eight speakers", "Fast charging"], variants: vv([c("Storm Blue", "#4a5d7a")], [["12 GB / 256 GB", 47999, 49999]]), flags: ["new"], launch: "2025-07-08" },
  { name: "Xiaomi Pad 7", brand: "Xiaomi", category: "Tablets", short: "3.2K display tablet with HyperOS.", highlights: ["3.2K 144Hz display", "Quad speakers", "Keyboard support"], variants: vv([c("Graphite Grey", "#55575a"), c("Mint Green", "#a8cfc0")], [["8 GB / 128 GB", 27999, 31999]]), flags: ["trending"] },
  // Laptops
  { name: "MacBook Air 13-inch (M4)", brand: "Apple", category: "Laptops", short: "Fanless, all-day battery with Apple M4.", highlights: ["Apple M4 chip", "Up to 18 hours battery", "Liquid Retina display"], variants: vv([c("Sky Blue", "#b9d0e3"), c("Midnight", "#2e3641")], [["16 GB / 256 GB", 99900, 99900], ["16 GB / 512 GB", 119900, 119900]]), flags: ["bestseller", "trending"] },
  { name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", category: "Laptops", short: "Slim everyday laptop with an OLED option.", highlights: ["OLED display option", "Backlit keyboard", "Rapid charge"], variants: vv([c("Cosmic Blue", "#2d3f5c")], [["16 GB / 512 GB", 66990, 82890]]) },
  { name: "HP Pavilion x360 14", brand: "HP", category: "Laptops", short: "Convertible touchscreen laptop.", highlights: ["360° hinge", "Touchscreen", "Pen support"], variants: vv([c("Natural Silver", "#c9cacb")], [["16 GB / 512 GB", 62990, 78999]]) },
  { name: "ASUS Vivobook 16", brand: "ASUS", category: "Laptops", short: "Big-screen laptop for study and office.", highlights: ["16-inch display", "Full-size keyboard", "Fast charging"], variants: vv([c("Quiet Blue", "#38455c")], [["16 GB / 512 GB", 52990, 66990]]), flags: ["bestseller"] },
  // Smartwatches
  { name: "Apple Watch Series 11", brand: "Apple", category: "Smartwatches", short: "Health and fitness companion for iPhone.", highlights: ["Always-On Retina display", "Health sensors", "Water resistant"], variants: vv([c("Jet Black", "#1a1a1a"), c("Rose Gold", "#e3b8a8")], [["42 mm GPS", 46900, 46900], ["46 mm GPS", 49900, 49900]]), flags: ["new"], launch: "2025-09-19" },
  { name: "Samsung Galaxy Watch8", brand: "Samsung", category: "Smartwatches", short: "Wear OS smartwatch with advanced health tracking.", highlights: ["Antioxidant index", "Sleep coaching", "Wear OS"], variants: vv([c("Graphite", "#3c3d40"), c("Silver", "#d0d2d4")], [["40 mm Bluetooth", 32999, 36999]]) },
  { name: "OnePlus Watch 3", brand: "OnePlus", category: "Smartwatches", short: "Long battery life Wear OS watch.", highlights: ["Multi-day battery", "Wear OS", "Health tracking"], variants: vv([c("Obsidian Titanium", "#2a2a2c")], [["43 mm", 24999, 27999]]) },
  // Audio
  { name: "AirPods Pro 3", brand: "Apple", category: "Earbuds", short: "Active Noise Cancellation and heart-rate sensing.", highlights: ["Active Noise Cancellation", "Adaptive Audio", "USB-C case"], variants: vv([c("White", "#f5f5f5")], [[undefined, 25900, 25900]]), flags: ["trending", "new"], launch: "2025-09-19" },
  { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "Earbuds", short: "Blade-design earbuds with ANC.", highlights: ["Adaptive ANC", "Hi-Fi sound", "Galaxy AI features"], variants: vv([c("Silver", "#cfd1d3"), c("White", "#f3f3f3")], [[undefined, 17999, 19999]]) },
  { name: "boAt Airdopes 141 ANC", brand: "boAt", category: "Earbuds", short: "Affordable earbuds with ANC.", highlights: ["Active Noise Cancellation", "Long playback", "Low-latency mode"], variants: vv([c("Gunmetal Black", "#2b2c2e"), c("Ivory White", "#efede6")], [[undefined, 1499, 4490]]), flags: ["bestseller"] },
  { name: "Sony WH-1000XM6", brand: "Sony", category: "Headphones", short: "Premium noise-cancelling headphones.", highlights: ["Industry-leading ANC", "Long battery life", "Multipoint"], variants: vv([c("Black", "#1c1c1c"), c("Platinum Silver", "#d6d4cf")], [[undefined, 39990, 44990]]) },
  { name: "JBL Tune 770NC", brand: "JBL", category: "Headphones", short: "Wireless headphones with adaptive noise cancelling.", highlights: ["Adaptive ANC", "JBL Pure Bass", "Fast pair"], variants: vv([c("Black", "#1c1c1c"), c("Blue", "#2f5fa8")], [[undefined, 5999, 9999]]) },
  // Accessories
  { name: "Apple 20W USB-C Power Adapter", brand: "Apple", category: "Chargers", short: "Fast charging for iPhone and iPad.", highlights: ["20W USB-C", "Fast charge compatible"], variants: vv([c("White", "#f5f5f5")], [[undefined, 1900, 1900]]), flags: ["bestseller"] },
  { name: "Samsung 25W Power Adapter", brand: "Samsung", category: "Chargers", short: "Super Fast Charging USB-C adapter.", highlights: ["25W Super Fast Charging", "USB-C"], variants: vv([c("Black", "#1c1c1c")], [[undefined, 1299, 1999]]) },
  { name: "Apple USB-C Woven Charge Cable (1 m)", brand: "Apple", category: "Cables", short: "Woven USB-C cable for charging and sync.", highlights: ["Woven design", "USB-C to USB-C"], variants: vv([c("White", "#f5f5f5")], [[undefined, 1900, 1900]]) },
  { name: "Xiaomi 20000mAh Power Bank", brand: "Xiaomi", category: "Power Banks", short: "High-capacity power bank with fast charging.", highlights: ["20000mAh", "Two-way fast charging", "Triple output"], variants: vv([c("Black", "#1c1c1c")], [[undefined, 2199, 3999]]) },
  // Electronics
  { name: "Sony BRAVIA 2 55-inch 4K Google TV", brand: "Sony", category: "Smart TVs", short: "4K HDR Google TV.", highlights: ["4K HDR", "Google TV", "Dolby Audio"], variants: vv([c("Black", "#111111")], [[undefined, 57990, 99900]]) },
  { name: "Samsung Crystal 4K 55-inch Smart TV", brand: "Samsung", category: "Smart TVs", short: "Crystal processor 4K smart TV.", highlights: ["Crystal Processor 4K", "Tizen OS", "HDR"], variants: vv([c("Black", "#111111")], [[undefined, 41990, 65900]]), flags: ["bestseller"] },
  { name: "JBL Flip 7", brand: "JBL", category: "Home Electronics", short: "Rugged portable Bluetooth speaker.", highlights: ["IP68", "Bold JBL sound", "Long playtime"], variants: vv([c("Black", "#1c1c1c"), c("Blue", "#2f5fa8"), c("Red", "#c4302b")], [[undefined, 13999, 14999]]) },
  { name: "Sony DualSense Wireless Controller", brand: "Sony", category: "Gaming Accessories", short: "PS5 controller with haptic feedback.", highlights: ["Haptic feedback", "Adaptive triggers", "Built-in mic"], variants: vv([c("White", "#f1f1f1"), c("Midnight Black", "#1c1c1c")], [[undefined, 5990, 6390]]) },
];

