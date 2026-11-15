export type ToolCategory = 'text' | 'image' | 'pdf' | 'calculators';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  href: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  badge?: string;
  keywords: string[];
  features: string[];
  howToSteps: HowToStep[];
  faqs: FAQItem[];
  metaTitle: string;
  metaDescription: string;
}

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  slug: string;
  href: string;
  description: string;
  iconName: string;
  toolCount: number;
}

export const CATEGORIES: Record<ToolCategory, CategoryDefinition> = {
  text: {
    id: 'text',
    name: 'Text Utilities',
    slug: 'text',
    href: '/category/text',
    description: 'Transform, format, analyze, and inspect text and data with client-side privacy.',
    iconName: 'FileText',
    toolCount: 8,
  },
  image: {
    id: 'image',
    name: 'Image Utilities',
    slug: 'image',
    href: '/category/image',
    description: 'Compress, resize, convert formats, and create QR codes and favicons instantly in browser.',
    iconName: 'Image',
    toolCount: 8,
  },
  pdf: {
    id: 'pdf',
    name: 'PDF Utilities',
    slug: 'pdf',
    href: '/category/pdf',
    description: 'Merge, split, compress, and extract PDF pages securely without uploading documents to a server.',
    iconName: 'FileCheck',
    toolCount: 4,
  },
  calculators: {
    id: 'calculators',
    name: 'Calculators',
    slug: 'calculators',
    href: '/category/calculators',
    description: 'Financial, mathematical, and date calculators with real-time interactive schedules.',
    iconName: 'Calculator',
    toolCount: 4,
  },
};

export const TOOLS: ToolDefinition[] = [
  // TEXT TOOLS (8)
  {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    category: 'text',
    href: '/tools/text/word-counter',
    shortDescription: 'Count words, characters, sentences, paragraphs, and estimated reading time in real-time.',
    longDescription:
      'Professional real-time word counter and writing statistics tool. Analyze text length, reading speed, speaking duration, sentence density, and keyword frequency instantly in your browser.',
    iconName: 'FileText',
    badge: 'Popular',
    keywords: ['word counter', 'character count', 'reading time', 'sentence counter', 'text analytics'],
    features: [
      'Instant real-time word and character counting',
      'Calculates reading time (~200 wpm) and speaking time (~130 wpm)',
      'Sentence, paragraph, and line count breakdown',
      'Top keyword density frequency analysis table',
      'Clean one-click copy, clear, and text download options',
    ],
    howToSteps: [
      { name: 'Paste or type text', text: 'Enter or paste your content directly into the editor.' },
      { name: 'Inspect statistics', text: 'View live updates of words, characters, reading time, and sentences.' },
      { name: 'Analyze keyword density', text: 'Check the keyword frequency list to optimize your writing.' },
    ],
    faqs: [
      {
        question: 'Is my text sent to any server?',
        answer: 'No. All calculations run strictly in your web browser. Your text never leaves your device.',
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is computed using the global average adult silent reading rate of 200 words per minute.',
      },
      {
        question: 'Does it count spaces in character counts?',
        answer: 'Yes, both metrics are displayed: total characters with spaces, and characters excluding spaces.',
      },
    ],
    metaTitle: 'Free Online Word Counter — Words, Characters & Reading Time',
    metaDescription:
      'Count words, characters with/without spaces, sentences, paragraphs, and reading time in real-time. Free browser-based text statistics analyzer.',
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    slug: 'character-counter',
    category: 'text',
    href: '/tools/text/character-counter',
    shortDescription: 'Detailed character analysis with social media limits for Twitter, SMS, and SEO meta tags.',
    longDescription:
      'Accurate character counter with instant feedback for character limits across X (Twitter), LinkedIn, SMS, Google SEO titles, and Meta descriptions.',
    iconName: 'Hash',
    keywords: ['character counter', 'letter count', 'twitter character limit', 'sms counter', 'meta description length'],
    features: [
      'Counts total characters, alphanumeric, letters, digits, and spaces',
      'Preset limit bars for X/Twitter (280), SMS (160), SEO Title (60), SEO Description (160)',
      'Detailed whitespace and symbol counts',
      'Word and line breakdowns',
      'Client-side instant calculations',
    ],
    howToSteps: [
      { name: 'Enter your copy', text: 'Type or paste the text you want to measure.' },
      { name: 'Check platform limits', text: 'Review visual progress meters for Twitter, SMS, and SEO tags.' },
      { name: 'Copy final text', text: 'Click copy to clipboard once your copy fits within limits.' },
    ],
    faqs: [
      {
        question: 'What is the standard SMS character limit?',
        answer: 'A standard single SMS message is limited to 160 GSM-7 characters. Messages exceeding this are split.',
      },
      {
        question: 'What is the optimal SEO title length?',
        answer: 'Google typically displays up to 55 to 60 characters before truncating search result titles.',
      },
    ],
    metaTitle: 'Free Character Counter — Social Media Limits & Letter Breakdown',
    metaDescription:
      'Measure exact character count, letters, numbers, spaces, and track limits for Twitter, SMS, and SEO tags in real-time.',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    category: 'text',
    href: '/tools/text/case-converter',
    shortDescription: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    longDescription:
      'Versatile text case conversion utility for writers and programmers. Effortlessly switch between Sentence case, UPPERCASE, lowercase, Capitalized Words, camelCase, PascalCase, snake_case, CONSTANT_CASE, and kebab-case.',
    iconName: 'CaseSensitive',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case'],
    features: [
      '10+ formatting modes: Sentence, Title, Upper, Lower, camelCase, PascalCase, snake_case, kebab-case',
      'Preserves punctuation and structure where appropriate',
      'Instant one-click transformation and clipboard copy',
      'Text file download support',
    ],
    howToSteps: [
      { name: 'Input your text', text: 'Paste the string or paragraph you want to convert.' },
      { name: 'Choose conversion case', text: 'Click your preferred case style button.' },
      { name: 'Copy or export', text: 'Copy the transformed text to your clipboard or download as .txt.' },
    ],
    faqs: [
      {
        question: 'How does Title Case handle articles and prepositions?',
        answer: 'Title Case capitalizes principal words while leaving standard minor words (like "of", "and", "in") lowercase unless they start the sentence.',
      },
      {
        question: 'Can I convert code identifiers?',
        answer: 'Yes! camelCase, PascalCase, snake_case, and kebab-case are tailored specifically for clean code variable transformations.',
      },
    ],
    metaTitle: 'Free Case Converter — UPPERCASE, Title Case, camelCase & More',
    metaDescription:
      'Convert text between uppercase, lowercase, sentence case, title case, camelCase, snake_case, and kebab-case instantly online.',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'text',
    href: '/tools/text/json-formatter',
    shortDescription: 'Format, validate, beautify, and minify JSON data with instant syntax error detection.',
    longDescription:
      'Clean and inspect JSON data. Features configurable 2-space, 4-space, and tab indentation, minification, tree-view structure exploration, and syntax error diagnostics with line and column highlighting.',
    iconName: 'Braces',
    badge: 'Essential',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'json minifier', 'json parser'],
    features: [
      'Syntax validation with precise line and character error markers',
      'Prettify with 2 spaces, 4 spaces, or tabs',
      'Minify JSON to single line for optimized payloads',
      'Collapsible interactive tree inspector',
      'Download formatted .json file with one click',
    ],
    howToSteps: [
      { name: 'Paste JSON', text: 'Enter your raw or unformatted JSON text.' },
      { name: 'Format or Minify', text: 'Select 2-spaces, 4-spaces, or Minify to apply changes.' },
      { name: 'Validate & Save', text: 'Inspect errors if any, copy the valid output, or download as a file.' },
    ],
    faqs: [
      {
        question: 'Are there file size limits?',
        answer: 'Because all parsing happens client-side in your browser, it comfortably handles multi-megabyte JSON files without network latency.',
      },
      {
        question: 'Does this tool validate trailing commas?',
        answer: 'Yes, strict JSON standards disallow trailing commas and unquoted keys. The validator flags them immediately.',
      },
    ],
    metaTitle: 'Free JSON Formatter & Validator — Beautify & Minify JSON',
    metaDescription:
      'Format, validate, prettify, and minify JSON online. Features syntax error detection, custom indentation, and tree viewer.',
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    slug: 'base64-encoder-decoder',
    category: 'text',
    href: '/tools/text/base64-encoder-decoder',
    shortDescription: 'Encode and decode UTF-8 text or binary files to Base64 format safely.',
    longDescription:
      'Full-featured Base64 utility supporting both text and file encoding/decoding. Implements true UTF-8 encoding without character corruption, data URI preview, and binary file download.',
    iconName: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 to text', 'file to base64', 'data uri generator'],
    features: [
      'Seamless encoding and decoding of Unicode / UTF-8 strings',
      'File-to-Base64 encoder with Data URI generation for images and documents',
      'Base64-to-file decoder with direct file download',
      'Real-time output with one-click copy',
    ],
    howToSteps: [
      { name: 'Select mode', text: 'Choose between Text mode or File mode.' },
      { name: 'Input data', text: 'Enter text or drop a file to convert.' },
      { name: 'Encode or Decode', text: 'Click Encode or Decode to view the resulting Base64 string or file.' },
    ],
    faqs: [
      {
        question: 'Why do non-ASCII characters sometimes break in other Base64 tools?',
        answer: 'Standard browser atob/btoa functions only support Latin1. Our implementation properly uses UTF-8 byte encoders so international characters remain intact.',
      },
      {
        question: 'Can I encode images to Data URIs?',
        answer: 'Yes! Upload any image in File mode to get a ready-to-use data:image/*;base64 string for HTML and CSS.',
      },
    ],
    metaTitle: 'Free Base64 Encoder & Decoder — Text and File Converter',
    metaDescription:
      'Encode text or files to Base64 and decode Base64 strings back to text or binary files. Full UTF-8 support and client-side privacy.',
  },
  {
    id: 'text-diff-checker',
    name: 'Text Diff Checker',
    slug: 'text-diff-checker',
    category: 'text',
    href: '/tools/text/text-diff-checker',
    shortDescription: 'Compare two text passages side-by-side or unified with added and removed highlights.',
    longDescription:
      'Compare versions of text, code, or documentation. Visualizes differences side-by-side or in a unified view, highlighting additions, deletions, and line-by-line changes clearly.',
    iconName: 'GitCompare',
    keywords: ['text diff checker', 'compare text', 'diff tool', 'text difference', 'code comparison'],
    features: [
      'Side-by-side and unified split diff views',
      'Character and word-level difference highlighting',
      'Displays added and removed line counters',
      'Ignore whitespace option for clean code reviews',
    ],
    howToSteps: [
      { name: 'Enter Original Text', text: 'Paste the base or original text into the left editor.' },
      { name: 'Enter Modified Text', text: 'Paste the modified or updated text into the right editor.' },
      { name: 'View Differences', text: 'Inspect color-coded differences with green additions and red deletions.' },
    ],
    faqs: [
      {
        question: 'Is my confidential source code uploaded to any server?',
        answer: 'Never. Diff computation runs directly within your browser JavaScript engine using the Myers diff algorithm.',
      },
      {
        question: 'Can I swap the two inputs?',
        answer: 'Yes, click the Swap button to invert original and modified texts instantly.',
      },
    ],
    metaTitle: 'Free Text Diff Checker — Compare Text & Code Differences Online',
    metaDescription:
      'Compare two texts side-by-side or unified to spot additions and deletions. Free, private, and instant browser diff tool.',
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    slug: 'slug-generator',
    category: 'text',
    href: '/tools/text/slug-generator',
    shortDescription: 'Convert any title or sentence into clean, SEO-friendly, URL-safe slugs.',
    longDescription:
      'Create clean, URL-friendly slugs for web addresses, articles, and product permalinks. Removes accents, special characters, and diacritics with custom separators.',
    iconName: 'Link',
    keywords: ['slug generator', 'url slug creator', 'permalink generator', 'seo slug tool', 'url sanitizer'],
    features: [
      'Diacritic and accent normalization (e.g., é -> e)',
      'Custom separator selection (hyphen - or underscore _)',
      'Option to preserve or strip numbers and uppercase letters',
      'Removes common English stop words (a, the, in, for) if desired',
      'Live preview and one-click copy',
    ],
    howToSteps: [
      { name: 'Enter title', text: 'Type your blog title, product name, or sentence.' },
      { name: 'Customize options', text: 'Choose separator character and toggle stop-word removal.' },
      { name: 'Copy slug', text: 'Click to copy the clean URL-ready slug.' },
    ],
    faqs: [
      {
        question: 'What is a URL slug?',
        answer: 'A slug is the human-readable, hyphenated end part of a web address that identifies a particular page (e.g., /tools/text/slug-generator).',
      },
      {
        question: 'Why are hyphens preferred over underscores for SEO?',
        answer: 'Major search engines like Google treat hyphens as word separators, whereas underscores may concatenate words together.',
      },
    ],
    metaTitle: 'Free Slug Generator — Create SEO-Friendly URL Slugs Online',
    metaDescription:
      'Convert titles, phrases, and text into clean, URL-safe slugs. Normalize accents, strip special characters, and optimize for search engines.',
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'text',
    href: '/tools/text/uuid-generator',
    shortDescription: 'Generate cryptographically secure Version 4 UUIDs individually or in bulk.',
    longDescription:
      'Generate RFC 4122 compliant version 4 UUIDs using browser crypto.getRandomValues(). Supports batch generation up to 1,000 UUIDs, custom uppercase formatting, braces, and hyphens removal.',
    iconName: 'Fingerprint',
    keywords: ['uuid generator', 'guid generator', 'v4 uuid', 'random uuid', 'bulk uuid'],
    features: [
      'Cryptographically secure random generation (Web Crypto API)',
      'Generate 1 to 1,000 UUIDs in a single click',
      'Formatting toggles: uppercase/lowercase, hyphens, and curly braces',
      'One-click copy all or download as .txt file',
    ],
    howToSteps: [
      { name: 'Choose quantity', text: 'Select how many UUIDs you need to generate (up to 1,000).' },
      { name: 'Configure format', text: 'Toggle uppercase, hyphens, or enclosing curly braces.' },
      { name: 'Generate & Copy', text: 'Click Generate, then copy individual UUIDs or download the list.' },
    ],
    faqs: [
      {
        question: 'What is a Version 4 UUID?',
        answer: 'A Version 4 UUID is a 128-bit universally unique identifier generated using random numbers, with an astronomically low collision probability (1 in 2^122).',
      },
      {
        question: 'Is this secure for production IDs and database keys?',
        answer: 'Yes. It uses window.crypto.getRandomValues(), the modern standard for cryptographic randomness in web browsers.',
      },
    ],
    metaTitle: 'Free UUID Generator — Bulk RFC 4122 v4 UUIDs Online',
    metaDescription:
      'Generate random, cryptographically secure Version 4 UUIDs online. Supports bulk generation, custom formatting, and instant export.',
  },

  // IMAGE TOOLS (8)
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'image',
    href: '/tools/image/image-compressor',
    shortDescription: 'Compress PNG, JPG, and WebP images client-side while preserving visual quality.',
    longDescription:
      'Reduce image file sizes without sacrificing clarity. Features real-time quality sliders, before-and-after visual inspection, and instant percentage savings calculation directly on your device.',
    iconName: 'Minimize2',
    badge: 'Popular',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'jpg compressor', 'png compressor'],
    features: [
      'Compress JPEG, PNG, and WebP images directly on client canvas',
      'Configurable quality slider (1% to 100%)',
      'Side-by-side original vs compressed file size display',
      'Full privacy: images never upload to an external server',
      'Instant download with preserved aspect ratio',
    ],
    howToSteps: [
      { name: 'Upload image', text: 'Drag and drop or browse to select your image.' },
      { name: 'Adjust quality', text: 'Slide the compression quality to balance size and sharpness.' },
      { name: 'Download image', text: 'Check the file size savings and download the compressed file.' },
    ],
    faqs: [
      {
        question: 'Will image compression affect my SEO?',
        answer: 'Yes, positively! Smaller images load faster, improving Core Web Vitals (LCP) and search engine rankings.',
      },
      {
        question: 'Are my photos saved on a server?',
        answer: 'No. The compression algorithm executes locally using HTML5 Canvas APIs within your browser.',
      },
    ],
    metaTitle: 'Free Online Image Compressor — Reduce JPG, PNG & WebP File Size',
    metaDescription:
      'Compress images online without quality loss. Reduce JPG, PNG, and WebP file sizes in your browser with real-time preview and 100% privacy.',
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'image',
    href: '/tools/image/image-resizer',
    shortDescription: 'Resize images by exact pixels or percentage with aspect ratio lock.',
    longDescription:
      'Precision image scaling utility. Adjust image dimensions by pixels or percentage scale, lock or unlock aspect ratio, and export to PNG, JPEG, or WebP with bicubic canvas interpolation.',
    iconName: 'Maximize2',
    keywords: ['image resizer', 'resize photo', 'change image dimensions', 'crop image', 'scale image'],
    features: [
      'Resize by custom width/height (px) or percentage (%)',
      'Smart aspect ratio locking to prevent distortion',
      'High quality canvas downsampling and upsampling',
      'Export format selection: JPEG, PNG, or WebP',
      'Live dimension and size preview',
    ],
    howToSteps: [
      { name: 'Drop your picture', text: 'Select an image from your computer or phone.' },
      { name: 'Set dimensions', text: 'Enter target width or height, or use the percentage slider.' },
      { name: 'Download resized image', text: 'Select format and download the scaled image.' },
    ],
    faqs: [
      {
        question: 'Can I enlarge an image without losing quality?',
        answer: 'Upscaling raster images beyond original dimensions inherently causes slight blurriness, but canvas smoothing maintains smooth edges.',
      },
      {
        question: 'Does aspect ratio lock keep my image proportional?',
        answer: 'Yes. Changing width automatically recalculates height proportionately when locked.',
      },
    ],
    metaTitle: 'Free Image Resizer — Resize Photos by Pixels or Percentage',
    metaDescription:
      'Resize images online by pixels or scale percentage with aspect ratio lock. Fast, free, and runs entirely in your browser.',
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    slug: 'jpg-to-png',
    category: 'image',
    href: '/tools/image/jpg-to-png',
    shortDescription: 'Convert JPG/JPEG images into lossless PNG format with transparent canvas support.',
    longDescription:
      'Convert JPEG images to high-fidelity PNG format. Ensures pristine rendering for graphics, logos, and illustrations with zero compression artifacting.',
    iconName: 'FileImage',
    keywords: ['jpg to png', 'convert jpg to png', 'jpeg to png', 'image converter', 'lossless png'],
    features: [
      'Lossless conversion preserving 100% pixel fidelity',
      'Batch conversion capability',
      'Instant client-side rendering with HTML5 Canvas',
      'Preview before download',
    ],
    howToSteps: [
      { name: 'Upload JPG', text: 'Select one or more JPG or JPEG photos.' },
      { name: 'Review preview', text: 'Examine the rendered PNG canvas output.' },
      { name: 'Save PNG', text: 'Click Download PNG to save your converted file.' },
    ],
    faqs: [
      {
        question: 'Why convert JPG to PNG?',
        answer: 'PNG is a lossless format ideal for screenshots, text, line art, and graphics where JPEG compression artifacts would cause blur.',
      },
      {
        question: 'Does converting JPG to PNG create transparency?',
        answer: 'No, original JPGs do not contain alpha transparency. The converted PNG preserves the original image background.',
      },
    ],
    metaTitle: 'Free JPG to PNG Converter — Convert JPEG to Lossless PNG Online',
    metaDescription:
      'Convert JPG and JPEG files to high quality PNG images instantly. 100% free and processed locally in your browser for total privacy.',
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP Converter',
    slug: 'png-to-webp',
    category: 'image',
    href: '/tools/image/png-to-webp',
    shortDescription: 'Convert heavy PNG graphics to modern, lightweight WebP files for faster web loading.',
    longDescription:
      'Speed up your website by converting PNG images to Google WebP format. WebP typically cuts file size by 30% to 70% while maintaining full alpha transparency.',
    iconName: 'FileCode2',
    keywords: ['png to webp', 'convert png to webp', 'webp converter', 'optimize web images', 'transparent webp'],
    features: [
      'Full alpha transparency channel preservation',
      'Selectable lossy quality or near-lossless compression',
      'Dramatic reduction in page weight and faster Core Web Vitals',
      'Instant browser-level conversion',
    ],
    howToSteps: [
      { name: 'Choose PNG file', text: 'Upload the PNG graphic or screenshot.' },
      { name: 'Adjust quality', text: 'Select compression quality (80-90% recommended for web).' },
      { name: 'Download WebP', text: 'Save your ultra-compact WebP file.' },
    ],
    faqs: [
      {
        question: 'Do all modern browsers support WebP?',
        answer: 'Yes! Modern versions of Chrome, Safari, Firefox, Edge, and mobile browsers offer universal WebP support.',
      },
      {
        question: 'Does WebP support transparency?',
        answer: 'Yes, WebP supports full 8-bit alpha transparency just like PNG, but with significantly smaller file sizes.',
      },
    ],
    metaTitle: 'Free PNG to WebP Converter — Reduce Size with Transparency',
    metaDescription:
      'Convert PNG images to lightweight WebP format online. Maintain transparency, cut file size by up to 70%, and boost website speed.',
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    slug: 'heic-to-jpg',
    category: 'image',
    href: '/tools/image/heic-to-jpg',
    shortDescription: 'Convert Apple iPhone HEIC and HEIF photos to universally compatible JPG images.',
    longDescription:
      'Convert Apple iOS HEIC (High Efficiency Image Container) photos to standard JPEG files that open on any computer, browser, or Android device.',
    iconName: 'Smartphone',
    keywords: ['heic to jpg', 'convert heic to jpg', 'heif to jpeg', 'iphone photo converter', 'apple image format'],
    features: [
      'Convert Apple iPhone .heic files directly on your computer',
      'Configurable JPEG quality slider',
      'Preserves original dimensions and color spaces',
      'Zero cloud uploads: completely private processing',
    ],
    howToSteps: [
      { name: 'Upload HEIC', text: 'Select a .heic photo from your iPhone or Mac.' },
      { name: 'Set quality', text: 'Adjust the output JPEG compression quality.' },
      { name: 'Download JPG', text: 'Download the standard JPEG file ready for any platform.' },
    ],
    faqs: [
      {
        question: 'What is a HEIC file?',
        answer: 'HEIC is the default photo format used on modern iPhones. While it saves space, many Windows apps and websites do not natively support it.',
      },
      {
        question: 'Are my private photos uploaded to a third party?',
        answer: 'No! The decoder runs in your local web browser, safeguarding your personal privacy.',
      },
    ],
    metaTitle: 'Free HEIC to JPG Converter — Convert iPhone Photos Online',
    metaDescription:
      'Convert HEIC and HEIF photos from iPhone to standard JPG images online. Free, fast, private, and compatible with all devices.',
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'image',
    href: '/tools/image/qr-code-generator',
    shortDescription: 'Generate custom QR codes for URLs, WiFi, plain text, and contacts with color controls.',
    longDescription:
      'Create high-resolution QR codes with customizable foreground and background colors, configurable error correction levels (L, M, Q, H), and instant PNG or SVG download.',
    iconName: 'QrCode',
    badge: 'Popular',
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'custom qr code', 'wifi qr code'],
    features: [
      'Generate QR codes for URLs, text, WiFi credentials, and phone numbers',
      'Custom foreground and background color pickers',
      'Configurable error correction levels (Low, Medium, Quartile, High)',
      'Export high-resolution PNG or crisp vector SVG',
      'Instant live preview while typing',
    ],
    howToSteps: [
      { name: 'Input content', text: 'Enter your URL, text, or information to encode.' },
      { name: 'Customize styling', text: 'Select colors and desired error correction margin.' },
      { name: 'Download code', text: 'Save your QR code as PNG or vector SVG.' },
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No. These are static QR codes that encode your data directly into the pixel pattern. They never expire.',
      },
      {
        question: 'Which error correction level should I choose?',
        answer: 'Level M (15% recovery) or Q (25% recovery) is ideal for standard scanning. Use High (30%) if you plan to print on rough materials.',
      },
    ],
    metaTitle: 'Free QR Code Generator — Create Custom QR Codes with Colors',
    metaDescription:
      'Generate high-resolution QR codes online with custom colors and error correction. Download PNG or SVG for print and digital use.',
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    slug: 'favicon-generator',
    category: 'image',
    href: '/tools/image/favicon-generator',
    shortDescription: 'Generate complete favicon packages (16x16, 32x32, 180x180 Apple Touch, 512x512) from any image.',
    longDescription:
      'Turn any logo or photo into a production-ready favicon bundle. Generates standard 16x16 and 32x32 favicons, 180x180 Apple Touch icons, and 192x192 / 512x512 Android PWA icons, complete with ready-to-paste HTML code.',
    iconName: 'Globe',
    keywords: ['favicon generator', 'create favicon', 'apple touch icon', 'website icon', 'ico generator'],
    features: [
      'Generates all standard sizes: 16x16, 32x32, 48x48, 180x180, 192x192, 512x512',
      'Live browser tab preview to check visibility',
      'Download complete ZIP package or individual PNG icons',
      'Includes copy-paste HTML <link> tags for your head section',
    ],
    howToSteps: [
      { name: 'Upload logo', text: 'Drop a square image or logo (PNG or JPG recommended).' },
      { name: 'Preview in browser tab', text: 'Check the real-world tab mock to ensure readability.' },
      { name: 'Download bundle', text: 'Download the ZIP archive and copy the provided HTML snippet.' },
    ],
    faqs: [
      {
        question: 'What is the best source image size for a favicon?',
        answer: 'A square image of 512x512 pixels with a transparent background offers the best source fidelity for all downscaled sizes.',
      },
      {
        question: 'What formats are included in the bundle?',
        answer: 'The package includes favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png (180x180), and android-chrome-192x192.png & 512x512.png.',
      },
    ],
    metaTitle: 'Free Favicon Generator — Create Multi-Size Favicon Packages Online',
    metaDescription:
      'Generate complete favicon bundles for all modern browsers, Apple devices, and Android. Includes ready-to-paste HTML code and ZIP export.',
  },
  {
    id: 'color-picker',
    name: 'Color Picker & Converter',
    slug: 'color-picker',
    category: 'image',
    href: '/tools/image/color-picker',
    shortDescription: 'Inspect colors, convert between HEX, RGB, HSL, CMYK, and test WCAG accessibility contrast.',
    longDescription:
      'Advanced color utility for web designers and developers. Seamlessly convert between HEX, RGB, HSL, HSV, and CMYK, generate harmonious color palettes (analogous, triadic, complementary), and check WCAG 2.1 AA/AAA contrast ratios.',
    iconName: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'hsl converter', 'wcag contrast checker', 'color palette generator'],
    features: [
      'Interactive visual color spectrum and slider controls',
      'Instant conversion across HEX, RGB, HSL, HSV, and CMYK formats',
      'Built-in WCAG 2.1 AA and AAA contrast ratio validator',
      'Generates harmonious palettes: complementary, analogous, triadic, and monochromatic',
      'Browser EyeDropper API integration when supported',
    ],
    howToSteps: [
      { name: 'Select a color', text: 'Use the spectrum, enter a HEX/RGB value, or pick from screen.' },
      { name: 'Check harmonies', text: 'Explore automatically generated complementary and analogous shades.' },
      { name: 'Verify contrast', text: 'Ensure your color passes WCAG AA/AAA standards for readability.' },
    ],
    faqs: [
      {
        question: 'What is the WCAG AA contrast ratio requirement?',
        answer: 'WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold).',
      },
      {
        question: 'Can I pick colors from anywhere on my screen?',
        answer: 'Yes, in supported browsers (Chromium-based), click the EyeDropper icon to sample any pixel on your desktop.',
      },
    ],
    metaTitle: 'Free Color Picker & Converter — HEX, RGB, HSL & WCAG Contrast',
    metaDescription:
      'Pick colors, convert between HEX, RGB, HSL, and CMYK, explore color harmonies, and check WCAG accessibility contrast ratios online.',
  },

  // PDF TOOLS (4)
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    category: 'pdf',
    href: '/tools/pdf/pdf-compressor',
    shortDescription: 'Reduce PDF document file size securely in your browser without uploading to the cloud.',
    longDescription:
      'Optimize and shrink large PDF documents for email attachments and web upload limits. Leverages client-side pdf-lib stream compression and resolution optimization with complete data confidentiality.',
    iconName: 'FileArchive',
    badge: 'Popular',
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'shrink pdf', 'client side pdf compression'],
    features: [
      'Selectable compression presets: Standard, High, and Maximum savings',
      '100% private: no documents leave your computer',
      'Shows before and after file size comparison with percentage saved',
      'Maintains document structure, links, and text sharpness',
    ],
    howToSteps: [
      { name: 'Upload PDF', text: 'Select a PDF document from your device.' },
      { name: 'Select compression level', text: 'Choose between Standard, High, or Maximum compression.' },
      { name: 'Download optimized PDF', text: 'Review the reduced file size and save your compressed document.' },
    ],
    faqs: [
      {
        question: 'Are my confidential PDF documents uploaded to a remote server?',
        answer: 'No! Unlike traditional online PDF tools that upload your sensitive contracts to remote servers, ToolBox processes the PDF entirely inside your browser.',
      },
      {
        question: 'Will text in the compressed PDF remain selectable?',
        answer: 'Yes, vector text streams and fonts remain fully intact and searchable.',
      },
    ],
    metaTitle: 'Free PDF Compressor — Reduce PDF File Size Online with 100% Privacy',
    metaDescription:
      'Compress PDF documents locally in your browser. Shrink PDF file size for email and web uploads without uploading sensitive files to cloud servers.',
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    category: 'pdf',
    href: '/tools/pdf/pdf-merger',
    shortDescription: 'Combine multiple PDF files into one clean document with custom page reordering.',
    longDescription:
      'Merge multiple PDF documents into a single consolidated file. Reorder documents effortlessly with intuitive move-up, move-down, or drag controls before exporting.',
    iconName: 'Layers',
    badge: 'Essential',
    keywords: ['pdf merger', 'merge pdf', 'combine pdf files', 'join pdfs', 'reorder pdf pages'],
    features: [
      'Combine unlimited PDF documents into a single unified file',
      'Reorder files up and down easily before merging',
      'Live page count summary for each document and total combined size',
      'Instant client-side assembly using pdf-lib',
    ],
    howToSteps: [
      { name: 'Select PDF files', text: 'Upload two or more PDF files you wish to merge.' },
      { name: 'Arrange sequence', text: 'Use the up/down arrows to position files in your desired order.' },
      { name: 'Merge & Download', text: 'Click Merge PDFs to generate and download your combined document.' },
    ],
    faqs: [
      {
        question: 'Is there a limit on the number of PDFs I can combine?',
        answer: 'There are no artificial limits. Since merging happens locally, it is bounded only by your browser memory.',
      },
      {
        question: 'Are bookmarks and form fields preserved?',
        answer: 'Standard page contents, text, and vector graphics are merged seamlessly into the new document.',
      },
    ],
    metaTitle: 'Free PDF Merger — Combine Multiple PDF Files Online Privately',
    metaDescription:
      'Merge multiple PDF documents into a single file online. Reorder documents, preview page counts, and download instantly without cloud uploads.',
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    category: 'pdf',
    href: '/tools/pdf/pdf-splitter',
    shortDescription: 'Extract specific pages or page ranges (e.g. 1-3, 5) into separate PDF documents.',
    longDescription:
      'Extract pages from any PDF document. Enter custom page ranges (like 1-5, 8, 11-14) or extract every page into individual files packaged in a ZIP archive.',
    iconName: 'Split',
    keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf'],
    features: [
      'Extract custom ranges like "1-3, 5, 8-10"',
      'Split into individual one-page PDFs with one click',
      'Download extracted pages as single PDF or grouped ZIP archive',
      'Private client-side processing keeps your documents safe',
    ],
    howToSteps: [
      { name: 'Upload PDF', text: 'Drop the PDF file you want to split.' },
      { name: 'Specify ranges', text: 'Enter target pages (e.g., 1-4, 7) or choose split all.' },
      { name: 'Download result', text: 'Save your extracted PDF document or ZIP collection.' },
    ],
    faqs: [
      {
        question: 'How do I specify multiple separate page ranges?',
        answer: 'Separate individual pages and ranges with commas, for example: 1-3, 5, 7-10.',
      },
      {
        question: 'Can I split password-protected PDFs?',
        answer: 'You must provide an unlocked PDF or enter the password before client-side extraction.',
      },
    ],
    metaTitle: 'Free PDF Splitter — Extract Pages & Split PDF Files Online',
    metaDescription:
      'Split PDF documents and extract specific pages or ranges online. Fast, secure, and 100% private browser processing.',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    slug: 'pdf-to-jpg',
    category: 'pdf',
    href: '/tools/pdf/pdf-to-jpg',
    shortDescription: 'Render PDF document pages into high-resolution JPG images with custom DPI settings.',
    longDescription:
      'Convert PDF pages into crystal-clear JPEG images. Choose between Standard (150 DPI) and High (300 DPI) resolutions, preview rendered pages, and download individually or in a single ZIP bundle.',
    iconName: 'ImageDown',
    keywords: ['pdf to jpg', 'convert pdf to image', 'pdf to jpeg', 'extract images from pdf', 'high dpi pdf to jpg'],
    features: [
      'High-resolution canvas rendering powered by PDF.js',
      'Selectable DPI quality: Standard (150 DPI) or Print-Ready (300 DPI)',
      'Preview all pages before downloading',
      'Download individual page images or all pages in a convenient ZIP file',
    ],
    howToSteps: [
      { name: 'Upload PDF', text: 'Select the PDF document you wish to convert.' },
      { name: 'Select resolution', text: 'Choose 150 DPI for web or 300 DPI for high-detail print quality.' },
      { name: 'Download images', text: 'Download single page images or the entire set as a ZIP.' },
    ],
    faqs: [
      {
        question: 'What DPI should I use for converting PDF to JPG?',
        answer: 'For screen viewing and social media, 150 DPI is crisp and fast. For printing or high-zoom needs, choose 300 DPI.',
      },
      {
        question: 'Does this tool preserve vector clarity?',
        answer: 'Yes, PDF.js renders fonts and vector shapes directly at the target pixel density for maximum clarity.',
      },
    ],
    metaTitle: 'Free PDF to JPG Converter — Convert PDF Pages to Images Online',
    metaDescription:
      'Convert PDF document pages into high-resolution JPG images online. Choose custom DPI, preview pages, and download as single images or ZIP.',
  },

  // CALCULATORS (4)
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'calculators',
    href: '/tools/calculators/age-calculator',
    shortDescription: 'Calculate exact age in years, months, days, hours, and countdown to next birthday.',
    longDescription:
      'Comprehensive chronological age calculator. Determines exact elapsed age down to days and hours, computes the day of the week you were born, provides a live next birthday countdown, and calculates life milestones.',
    iconName: 'Calendar',
    badge: 'Popular',
    keywords: ['age calculator', 'calculate exact age', 'how old am i', 'birthday countdown', 'chronological age'],
    features: [
      'Exact breakdown in years, months, days, total weeks, hours, and minutes',
      'Live countdown to next upcoming birthday',
      'Shows birth day of the week and astrological zodiac sign',
      'Life milestone tracker (10,000 days alive, golden birthdays)',
    ],
    howToSteps: [
      { name: 'Enter date of birth', text: 'Select your birthday from the calendar picker.' },
      { name: 'Set reference date', text: 'Optionally adjust the calculation date (defaults to today).' },
      { name: 'Inspect detailed stats', text: 'View exact years, months, total days, and next birthday countdown.' },
    ],
    faqs: [
      {
        question: 'Does the calculator account for leap years?',
        answer: 'Yes, full calendar leap years and varying month lengths (28, 29, 30, and 31 days) are accurately calculated.',
      },
      {
        question: 'Can I calculate age as of a past or future date?',
        answer: 'Yes! You can customize the reference "Age at the Date of" field to any historical or future date.',
      },
    ],
    metaTitle: 'Free Age Calculator — Exact Age in Years, Months, Days & Hours',
    metaDescription:
      'Calculate exact age in years, months, days, hours, and minutes. Includes next birthday countdown, day of week born, and milestones.',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'calculators',
    href: '/tools/calculators/percentage-calculator',
    shortDescription: 'Solve percentage problems: what is X% of Y, percentage increase/decrease, and discounts.',
    longDescription:
      'Multi-purpose percentage calculation suite. Solves common scenarios instantly: calculate X% of Y, find what percentage X is of Y, compute percentage change (increase/decrease), and calculate price discounts with tax.',
    iconName: 'Percent',
    badge: 'Essential',
    keywords: ['percentage calculator', 'calculate percentage', 'percent increase', 'percent decrease', 'discount calculator'],
    features: [
      '4 essential calculation modes in one easy tabbed interface',
      'Calculate percentage value: What is X% of Y?',
      'Calculate percentage ratio: X is what percent of Y?',
      'Calculate percentage change: Growth or drop from value A to value B',
      'Calculate price after discount and sales tax',
    ],
    howToSteps: [
      { name: 'Choose scenario', text: 'Select the formula or mode that matches your math question.' },
      { name: 'Input numbers', text: 'Enter the two relevant numbers.' },
      { name: 'View instant result', text: 'See the exact result with step-by-step formula explanations.' },
    ],
    faqs: [
      {
        question: 'How do you calculate percentage increase?',
        answer: 'Subtract the old value from the new value, divide the difference by the original value, and multiply by 100.',
      },
      {
        question: 'How do you calculate discount price?',
        answer: 'Multiply the original price by (1 minus the discount percentage divided by 100).',
      },
    ],
    metaTitle: 'Free Percentage Calculator — 4 Quick Percentage Solvers Online',
    metaDescription:
      'Calculate percentage of a number, percentage increase/decrease, ratios, and sales discounts with instant formulas and explanations.',
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator (Loan Calculator)',
    slug: 'emi-calculator',
    category: 'calculators',
    href: '/tools/calculators/emi-calculator',
    shortDescription: 'Calculate monthly loan EMI, total interest, and interactive month-by-month amortization schedule.',
    longDescription:
      'Financial planning tool for home loans, auto loans, and personal loans. Calculates monthly Equated Monthly Installment (EMI), total interest payable, overall payment breakdown, and generates a downloadable yearly/monthly amortization schedule.',
    iconName: 'Coins',
    keywords: ['emi calculator', 'loan calculator', 'mortgage calculator', 'amortization schedule', 'home loan emi'],
    features: [
      'Instant monthly EMI calculation using the standard financial formula',
      'Visual breakdown of Principal vs Total Interest',
      'Toggle between loan tenure in years or months',
      'Interactive year-by-year and month-by-month amortization table',
      'Export complete loan repayment schedule to CSV',
    ],
    howToSteps: [
      { name: 'Enter loan amount', text: 'Type the total principal amount you plan to borrow.' },
      { name: 'Enter interest rate', text: 'Provide the annual interest percentage (e.g. 7.5%).' },
      { name: 'Set loan tenure', text: 'Specify the loan duration in years or months.' },
      { name: 'Inspect amortization', text: 'Review the monthly EMI, total interest, and amortization schedule.' },
    ],
    faqs: [
      {
        question: 'What is the standard EMI formula?',
        answer: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is Principal, R is monthly interest rate, and N is the number of monthly installments.',
      },
      {
        question: 'Can I export the repayment schedule?',
        answer: 'Yes! Click "Export CSV" to download the complete month-by-month principal and interest breakdown.',
      },
    ],
    metaTitle: 'Free EMI Calculator — Calculate Loan EMI & Amortization Schedule',
    metaDescription:
      'Calculate monthly EMI, total interest payable, and repayment schedule for home, car, or personal loans. Includes interactive amortization table and CSV export.',
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'calculators',
    href: '/tools/calculators/compound-interest-calculator',
    shortDescription: 'Forecast investment growth with regular monthly deposits and compounding frequencies.',
    longDescription:
      'Plan your wealth accumulation and retirement savings. Forecast investment growth over time with initial principal, monthly or annual deposits, custom interest rates, and compounding frequencies (annually, quarterly, monthly, daily).',
    iconName: 'TrendingUp',
    keywords: ['compound interest calculator', 'investment calculator', 'future value calculator', 'savings calculator', 'wealth growth'],
    features: [
      'Flexible compounding frequencies: Annually, Semi-Annually, Quarterly, Monthly, Daily',
      'Supports optional regular periodic deposits (monthly or annually)',
      'Visual growth comparison: Total Contributions vs Compound Interest Earned',
      'Year-by-year balance schedule with export to CSV',
    ],
    howToSteps: [
      { name: 'Enter initial balance', text: 'Input your starting investment or deposit amount.' },
      { name: 'Add periodic contribution', text: 'Optionally set monthly or annual contributions.' },
      { name: 'Set interest & frequency', text: 'Enter expected annual rate of return and compounding frequency.' },
      { name: 'Review growth forecast', text: 'View the final future value and year-by-year accumulation table.' },
    ],
    faqs: [
      {
        question: 'What is compound interest?',
        answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods, leading to exponential growth.',
      },
      {
        question: 'How does compounding frequency affect total returns?',
        answer: 'More frequent compounding (e.g., daily or monthly vs annually) increases the effective annual yield and generates higher final wealth.',
      },
    ],
    metaTitle: 'Free Compound Interest Calculator — Forecast Savings & Investments',
    metaDescription:
      'Calculate compound interest and future investment growth with regular deposits, compounding frequency options, and year-by-year schedules.',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query.trim()) return TOOLS;
  const q = query.toLowerCase().trim();
  return TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
      tool.category.toLowerCase().includes(q)
  );
}
