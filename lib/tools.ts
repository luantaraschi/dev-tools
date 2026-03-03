export type ToolCategory = "Formatters & Text" | "Images & Colors" | "Generators & Utilities" | "CSS & Design" | "Calculators & Math"

export type ToolDefinition = {
  slug: string
  href: string
  title: string
  description: string
  category: ToolCategory
  status?: "Ready" | "WIP"
}

export const tools: ToolDefinition[] = [
  {
    slug: "time-converter",
    href: "/time-converter",
    title: "Time Converter",
    description:
      "Convert timestamps between timezones and date formats instantly.",
    category: "Calculators & Math",
  },
  {
    slug: "password-generator",
    href: "/password-generator",
    title: "Password Generator",
    description: "Generate strong, customizable passwords with one click.",
    category: "Generators & Utilities",
  },
  {
    slug: "color-harmony",
    href: "/color-harmony",
    title: "Color Harmony",
    description:
      "Build beautiful color palettes using harmony rules like triads and tetrads.",
    category: "Images & Colors",
  },
  {
    slug: "color-palette-extractor",
    href: "/color-palette-extractor",
    title: "Color Palette Extractor",
    description: "Extract dominant colors from any uploaded image in seconds.",
    category: "Images & Colors",
  },
  {
    slug: "qr-generator",
    href: "/qr-generator",
    title: "QR Generator",
    description: "Generate QR codes for URLs, text, or contact info instantly.",
    category: "Generators & Utilities",
  },
  {
    slug: "image-converter",
    href: "/image-converter",
    title: "Image Converter",
    description:
      "Convert images between formats like PNG, JPEG, WebP, and more.",
    category: "Images & Colors",
    status: "WIP",
  },
  {
    slug: "bg-remover",
    href: "/bg-remover",
    title: "BG Remover",
    description:
      "Remove image backgrounds automatically using AI-powered processing.",
    category: "Images & Colors",
    status: "WIP",
  },
  {
    slug: "image-compressor",
    href: "/image-compressor",
    title: "Image Compressor",
    description:
      "Compress images without visible quality loss for faster web performance.",
    category: "Images & Colors",
    status: "WIP",
  },
  {
    slug: "text-to-pdf",
    href: "/text-to-pdf",
    title: "Text to PDF",
    description:
      "Convert text or markdown documents into well-formatted PDF files.",
    category: "Formatters & Text",
  },
  {
    slug: "json-formatter",
    href: "/json-formatter",
    title: "JSON Formatter",
    description:
      "Prettify, minify, and validate JSON data with syntax highlighting.",
    category: "Formatters & Text",
  },
  {
    slug: "case-converter",
    href: "/case-converter",
    title: "Case Converter",
    description:
      "Transform text into camelCase, snake_case, PascalCase, kebab-case, and more.",
    category: "Formatters & Text",
  },
  {
    slug: "uuid-generator",
    href: "/uuid-generator",
    title: "UUID Generator",
    description:
      "Generate one or many random UUID v4 values instantly using crypto APIs.",
    category: "Generators & Utilities",
  },
  {
    slug: "box-shadow-glassmorphism",
    href: "/box-shadow-glassmorphism",
    title: "Box Shadow / Glassmorphism",
    description:
      "Build box-shadow and glassmorphism styles with live preview and ready-to-copy CSS.",
    category: "CSS & Design",
  },
  {
    slug: "mesh-gradient-generator",
    href: "/mesh-gradient-generator",
    title: "Mesh Gradient Generator",
    description:
      "Create modern mesh-like gradients with customizable colors and angle.",
    category: "CSS & Design",
  },
  {
    slug: "image-ocr",
    href: "/image-ocr",
    title: "Image OCR",
    description:
      "Extract text from images in the browser with OCR and copy the result.",
    category: "Images & Colors",
  },
  {
    slug: "random-drawer",
    href: "/random-drawer",
    title: "Random Drawer & Roulette",
    description:
      "Draw names or numbers randomly, and spin the roulette for fun decisions.",
    category: "Generators & Utilities",
  },
  {
    slug: "percentage-calculator",
    href: "/percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Easily calculate percentages, ratios, and percentage increases/decreases.",
    category: "Calculators & Math",
  },
]

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug)
}
