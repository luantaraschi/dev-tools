export type ToolDefinition = {
  slug: string
  href: string
  title: string
  description: string
}

export const tools: ToolDefinition[] = [
  {
    slug: "time-converter",
    href: "/time-converter",
    title: "Time Converter",
    description:
      "Convert timestamps between timezones and date formats instantly.",
  },
  {
    slug: "password-generator",
    href: "/password-generator",
    title: "Password Generator",
    description: "Generate strong, customizable passwords with one click.",
  },
  {
    slug: "color-harmony",
    href: "/color-harmony",
    title: "Color Harmony",
    description:
      "Build beautiful color palettes using harmony rules like triads and tetrads.",
  },
  {
    slug: "color-palette-extractor",
    href: "/color-palette-extractor",
    title: "Color Palette Extractor",
    description: "Extract dominant colors from any uploaded image in seconds.",
  },
  {
    slug: "qr-generator",
    href: "/qr-generator",
    title: "QR Generator",
    description: "Generate QR codes for URLs, text, or contact info instantly.",
  },
  {
    slug: "image-converter",
    href: "/image-converter",
    title: "Image Converter",
    description:
      "Convert images between formats like PNG, JPEG, WebP, and more.",
  },
  {
    slug: "bg-remover",
    href: "/bg-remover",
    title: "BG Remover",
    description:
      "Remove image backgrounds automatically using AI-powered processing.",
  },
  {
    slug: "image-compressor",
    href: "/image-compressor",
    title: "Image Compressor",
    description:
      "Compress images without visible quality loss for faster web performance.",
  },
  {
    slug: "text-to-pdf",
    href: "/text-to-pdf",
    title: "Text to PDF",
    description:
      "Convert text or markdown documents into well-formatted PDF files.",
  },
  {
    slug: "json-formatter",
    href: "/json-formatter",
    title: "JSON Formatter",
    description:
      "Prettify, minify, and validate JSON data with syntax highlighting.",
  },
  {
    slug: "case-converter",
    href: "/case-converter",
    title: "Case Converter",
    description:
      "Transform text into camelCase, snake_case, PascalCase, kebab-case, and more.",
  },
  {
    slug: "uuid-generator",
    href: "/uuid-generator",
    title: "UUID Generator",
    description:
      "Generate one or many random UUID v4 values instantly using crypto APIs.",
  },
  {
    slug: "box-shadow-glassmorphism",
    href: "/box-shadow-glassmorphism",
    title: "Box Shadow / Glassmorphism",
    description:
      "Build box-shadow and glassmorphism styles with live preview and ready-to-copy CSS.",
  },
  {
    slug: "mesh-gradient-generator",
    href: "/mesh-gradient-generator",
    title: "Mesh Gradient Generator",
    description:
      "Create modern mesh-like gradients with customizable colors and angle.",
  },
  {
    slug: "image-ocr",
    href: "/image-ocr",
    title: "Image OCR",
    description:
      "Extract text from images in the browser with OCR and copy the result.",
  },
]

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug)
}
