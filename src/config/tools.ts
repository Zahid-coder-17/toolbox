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
        question: 'What is the Word Counter tool?',
        answer: 'The Word Counter is a real-time text analysis utility that measures words, characters, sentences, paragraphs, and reading times directly in your browser. It helps writers, students, translators, and SEO specialists adhere to strict character and length limits.',
      },
      {
        question: 'How does the Word Counter calculate word count?',
        answer: 'It uses Unicode-aware regular expression tokenization supporting alphabets, digits, hyphens, and apostrophes across multiple languages. Contractions such as don\'t or hyphenated phrases like state-of-the-art are counted accurately according to standard editorial guidelines.',
      },
      {
        question: 'Is there any character or text length limit?',
        answer: 'No. Processing occurs in your local browser runtime memory. You can analyze essays, articles, or large book chapters consisting of tens of thousands of words without server timeout errors or bandwidth constraints.',
      },
      {
        question: 'Is my text data private and secure?',
        answer: 'Yes, 100% private. Your text is processed strictly within client-side memory. No documents, paragraphs, or snippets are ever uploaded, logged, or transmitted across external networks.',
      },
      {
        question: 'How are reading and speaking times estimated?',
        answer: 'Silent reading time is estimated using the global adult average rate of 200 words per minute. Speaking duration is computed at 130 words per minute, which represents standard conversational presentation pace.',
      },
      {
        question: 'What is the Keyword Density feature?',
        answer: 'The keyword density analysis identifies recurring words in your text and calculates their occurrence percentage. It automatically excludes common English stop words to reveal genuine topical focus for SEO writing.',
      },
      {
        question: 'Can I use the Word Counter on mobile devices?',
        answer: 'Yes. The interface is fully responsive on smartphones, tablets, and desktop browsers, featuring touch-friendly copy, clear, and download actions.',
      },
      {
        question: 'Can I export or download my text analysis?',
        answer: 'Yes. You can copy the entire text to your clipboard with one click or download it directly as a formatted plain text (.txt) file.',
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
        question: 'What is the Character Counter tool?',
        answer: 'The Character Counter calculates exact character metrics, including total characters, characters without spaces, syllables, and real-time social platform limit meters for Twitter, LinkedIn, SMS, and Instagram.',
      },
      {
        question: 'Does the Character Counter count spaces?',
        answer: 'The tool displays two distinct counts: Total Characters (including whitespaces, line breaks, and tabs) and Characters Without Spaces, giving you precision for academic and publishing guidelines.',
      },
      {
        question: 'How are emojis and Unicode symbols counted?',
        answer: 'Emojis and multi-byte Unicode glyphs are accurately parsed by surrogate pair boundaries. While some systems count emojis as multiple bytes, our counter measures true visual code point symbols.',
      },
      {
        question: 'What social media character limits are tracked?',
        answer: 'The tool tracks real-time progress bars for X / Twitter posts (280 characters), SMS messages (160 characters), LinkedIn status updates (3,000 characters), and Instagram captions (2,200 characters).',
      },
      {
        question: 'Is registration or payment required?',
        answer: 'No. The tool is completely free with no user accounts, subscriptions, or credit card requirements.',
      },
      {
        question: 'Is my text stored anywhere?',
        answer: 'No. The tool operates client-side with zero remote database persistence. Clearing the editor or closing your browser tab permanently purges all typed content from memory.',
      },
      {
        question: 'Does it count line breaks and paragraphs?',
        answer: 'Yes. Line breaks count as single character returns, and the paragraph analyzer measures paragraph density alongside standard metrics.',
      },
      {
        question: 'Can I use it offline?',
        answer: 'Yes. Once the web application is loaded in your browser, the character counting scripts operate entirely locally without an active internet connection.',
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
        question: 'What text cases can this tool convert?',
        answer: 'The Case Converter transforms text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case instantly with a single click.',
      },
      {
        question: 'How does Title Case conversion work?',
        answer: 'Title Case capitalizes the primary words while automatically keeping minor words (such as in, on, of, the, and, a) in lowercase unless they appear at the very start of a sentence or heading.',
      },
      {
        question: 'Does it support code formats like snake_case and camelCase?',
        answer: 'Yes. It strips punctuation and joins word tokens with underscores for snake_case or standard uppercase letter transitions for camelCase and PascalCase, ideal for developers.',
      },
      {
        question: 'Will it work on accents and international alphabets?',
        answer: 'Yes. The conversion engine uses standard Unicode uppercase and lowercase mappings, preserving accents, umlauts, and non-Latin alphabets like Spanish, French, and German characters.',
      },
      {
        question: 'Is there a limit on how much text I can convert?',
        answer: 'There is no server limit. You can paste and convert entire code documents, essays, or CSV files within the capacity of your device memory.',
      },
      {
        question: 'Is my text uploaded to a server?',
        answer: 'No. All string manipulations execute in JavaScript running in your local browser sandbox without server interaction.',
      },
      {
        question: 'Can I copy the converted text easily?',
        answer: 'Yes. Each case card provides a dedicated one-click Copy button with immediate visual feedback so you can paste it directly into your code editor or document.',
      },
      {
        question: 'Can I convert text back to its original form?',
        answer: 'Yes, by pasting your text again or selecting your preferred previous case format. We recommend saving original copies before making permanent bulk transformations.',
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
        question: 'What is the JSON Formatter & Validator?',
        answer: 'The JSON Formatter is a developer utility that parses, formats, indents, minifies, and validates JSON payloads. It highlights syntax errors with precise line and column indicators.',
      },
      {
        question: 'How does the JSON validator locate errors?',
        answer: 'When invalid JSON is parsed, the engine catches syntax exceptions and outputs the exact character position and line number where an unclosed quote, trailing comma, or invalid token occurred.',
      },
      {
        question: 'Can it handle minification for production payloads?',
        answer: 'Yes. You can switch between 2-space indentation, 4-space indentation, and compact Minified output to reduce payload size before API transmissions.',
      },
      {
        question: 'Is it safe to format proprietary JSON data?',
        answer: 'Yes. Traditional web formatters send your JSON strings to remote servers. ToolBox parses and validates everything locally in client memory, keeping API keys, tokens, and confidential customer payloads safe.',
      },
      {
        question: 'Can it parse nested arrays and objects?',
        answer: 'Yes. It supports deep nested JSON objects, arrays of mixed types, Unicode strings, boolean values, null values, and scientific notation numbers.',
      },
      {
        question: 'Does it support downloading the formatted JSON?',
        answer: 'Yes. You can download the formatted output directly as a .json file with UTF-8 character encoding or copy it to your clipboard.',
      },
      {
        question: 'Why do trailing commas fail validation?',
        answer: 'Strict JSON syntax (RFC 8259) prohibits trailing commas after the final key-value pair or array element. The validator flags them to prevent runtime crashes in downstream APIs.',
      },
      {
        question: 'Can I format large JSON files?',
        answer: 'Yes. It easily formats multi-megabyte JSON files. For exceptionally large inputs, processing runs in a non-blocking queue to prevent browser freezes.',
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
        question: 'What is Base64 encoding?',
        answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format using 64 printable characters, ensuring safe data transmission across text-only protocols.',
      },
      {
        question: 'Does this tool support Unicode and UTF-8 characters?',
        answer: 'Yes. Many naive Base64 tools fail or corrupt text when processing emojis or foreign alphabets. Our engine utilizes UTF-8 byte stream encoding prior to Base64 conversion to preserve character fidelity.',
      },
      {
        question: 'How does the live mode switch between Encode and Decode work?',
        answer: 'You can toggle between Encode and Decode modes seamlessly. In Encode mode, plain text is transformed into Base64; in Decode mode, valid Base64 is converted back into readable text.',
      },
      {
        question: 'What happens if I enter invalid Base64 in Decode mode?',
        answer: 'The parser detects non-Base64 characters or invalid padding lengths and displays an inline warning banner explaining the decoding issue without crashing.',
      },
      {
        question: 'Is Base64 considered encryption?',
        answer: 'No. Base64 is an encoding format, not encryption. Anyone can decode Base64 data back to plain text. Do not use Base64 alone to protect confidential passwords or secrets.',
      },
      {
        question: 'Is my encoded or decoded text secure?',
        answer: 'Yes. Processing is executed entirely in your browser memory. No tokens or decoded strings are ever transmitted to an external logging server.',
      },
      {
        question: 'Can I download the converted result?',
        answer: 'Yes. You can copy the result directly or download it as a plain text file.',
      },
      {
        question: 'Does this tool work offline?',
        answer: 'Yes. Once loaded, the Base64 encoding and decoding algorithms work without an active internet connection.',
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
        question: 'What is the Text Diff Checker?',
        answer: 'The Text Diff Checker compares two passages of text or code and highlights additions, deletions, and modifications using character and word-level diff algorithms.',
      },
      {
        question: 'What comparison modes are supported?',
        answer: 'You can inspect differences in Split (side-by-side) mode or Unified (inline) mode, and choose between word-level or line-level comparison granularity.',
      },
      {
        question: 'How are additions and deletions highlighted?',
        answer: 'Additions are highlighted with soft green backgrounds and plus badges, while deleted or replaced text is highlighted with soft red backgrounds and minus badges.',
      },
      {
        question: 'Is it safe to compare confidential code or contracts?',
        answer: 'Yes. Unlike cloud diff checkers, both passages remain entirely on your local machine. No diff queries or document drafts are sent to external databases.',
      },
      {
        question: 'Can I swap the original and modified passages?',
        answer: 'Yes. A dedicated Swap button allows you to invert the comparison direction instantly without manually cutting and pasting text.',
      },
      {
        question: 'Does it count total differences?',
        answer: 'Yes. A summary bar displays the exact number of additions, deletions, and unchanged lines detected between the two inputs.',
      },
      {
        question: 'Can I compare code snippets in different languages?',
        answer: 'Yes. The diff algorithm compares raw text characters and tokens, making it effective for Python, JavaScript, HTML, SQL, markdown, or natural language prose.',
      },
      {
        question: 'Is there a file upload option?',
        answer: 'You can paste directly into the two split text areas or drag and drop text from your clipboard.',
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
        answer: 'A URL slug is the human-readable, hyphen-separated portion of a web address that identifies a specific page in a search engine friendly format (e.g., /blog/seo-guide).',
      },
      {
        question: 'How does the Slug Generator sanitize text?',
        answer: 'It converts characters to lowercase, replaces spaces with hyphens, strips punctuation, and normalizes international diacritics (like turning é into e) to ensure URL compatibility.',
      },
      {
        question: 'Can I choose a separator other than a hyphen?',
        answer: 'Yes. You can select between standard hyphens (-), underscores (_), dots (.), or empty concatenation.',
      },
      {
        question: 'Does it remove English stop words?',
        answer: 'Yes. You can toggle the Stop Words Filter to automatically remove common filler words (like the, and, in, of, a) to produce cleaner, more concise SEO URLs.',
      },
      {
        question: 'Does it handle non-Latin alphabets?',
        answer: 'Yes. Non-Latin scripts (such as Cyrillic, Greek, or Arabic) are transliterated or preserved into URL-encoded tokens depending on the chosen configuration.',
      },
      {
        question: 'Is registration required?',
        answer: 'No. You can generate unlimited slugs for blog posts, products, or documentation pages completely free.',
      },
      {
        question: 'Is my input text stored?',
        answer: 'No. Everything runs immediately inside your browser session with zero server data retention.',
      },
      {
        question: 'Can I copy the generated slug quickly?',
        answer: 'Yes. A one-click copy button immediately transfers the sanitized slug to your clipboard.',
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
        question: 'What is a UUID v4?',
        answer: 'A UUID (Universally Unique Identifier) version 4 is a 128-bit identifier generated using cryptographically strong pseudo-random numbers (RFC 4122) with negligible probability of duplication.',
      },
      {
        question: 'How does this tool generate secure UUIDs?',
        answer: 'It utilizes the native browser Web Crypto API (crypto.getRandomValues), providing cryptographically secure randomness generated directly by your device hardware.',
      },
      {
        question: 'Can I generate multiple UUIDs at once?',
        answer: 'Yes. You can generate bulk batches from 1 up to 1,000 UUIDs simultaneously with instant generation and copy capabilities.',
      },
      {
        question: 'What formatting options are available?',
        answer: 'You can toggle uppercase formatting, hyphen removal (clean 32-character hex strings), or wrapping UUIDs in curly braces for registry/database configurations.',
      },
      {
        question: 'Are generated UUIDs stored or tracked?',
        answer: 'No. Because they are generated in-memory via client-side Web Crypto, neither ToolBox nor any third party has a record of the identifiers created.',
      },
      {
        question: 'What is the chance of two UUID v4 collisions?',
        answer: 'The probability of generating a duplicate UUID v4 is approximately 1 in 2.71 quintillion, making collisions virtually impossible for practical database primary keys.',
      },
      {
        question: 'Can I download the batch of UUIDs?',
        answer: 'Yes. You can download the generated list as a formatted text (.txt) file or copy all UUIDs to your clipboard.',
      },
      {
        question: 'Does the tool work offline?',
        answer: 'Yes. The Web Crypto API is built into all modern browsers and functions without an active network connection.',
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
        question: 'How does the Image Compressor reduce file size?',
        answer: 'It applies intelligent lossy and lossless Canvas encoding, optimizing DCT matrices and stripping unneeded image metadata (EXIF) to minimize file size while preserving visual fidelity.',
      },
      {
        question: 'Are my photos uploaded to a cloud server?',
        answer: 'No. All image decoding, rendering, and compression occurs locally in your browser using HTML5 Canvas APIs and Web Workers. Your personal photos never leave your device.',
      },
      {
        question: 'What image formats can I compress?',
        answer: 'The tool supports JPEG, JPG, PNG, and WebP images. You can adjust the quality slider to find the optimal balance between visual clarity and file size reduction.',
      },
      {
        question: 'Can I compare the before and after image quality?',
        answer: 'Yes. The interface shows the original file size, compressed file size, compression ratio percentage, and side-by-side visual previews.',
      },
      {
        question: 'Does compression change image pixel dimensions?',
        answer: 'No. Unless you explicitly choose to resize the image in the Image Resizer, the Image Compressor preserves original width and height dimensions.',
      },
      {
        question: 'Is there a file count or size limit?',
        answer: 'Because operations execute inside your device RAM, there are no artificial hourly limits or queue delays. You can compress multiple photos consecutively.',
      },
      {
        question: 'How much file size reduction can I expect?',
        answer: 'Typical JPEG and PNG photos see file size reductions of 40% to 80% with negligible loss of perceptible visual quality.',
      },
      {
        question: 'Can I use this tool on my iPhone or Android device?',
        answer: 'Yes. The compressor is optimized for mobile touchscreens and modern mobile browser hardware acceleration.',
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
        question: 'How does the Image Resizer work?',
        answer: 'The Image Resizer recalculates pixel dimensions using high-quality bi-cubic Canvas interpolation, enabling you to scale images by exact pixel width/height or by percentage.',
      },
      {
        question: 'Can I lock the aspect ratio?',
        answer: 'Yes. You can lock the aspect ratio with the link toggle, so modifying the width automatically updates the height proportionally, preventing image distortion.',
      },
      {
        question: 'Are my images kept private?',
        answer: 'Yes. The resizing process runs entirely on your local CPU/GPU using browser Canvas buffers. No image bytes are sent over the internet.',
      },
      {
        question: 'What are standard preset dimensions available?',
        answer: 'The tool provides quick presets for social media platforms, including Instagram square (1080x1080), YouTube thumbnail (1280x720), and standard web banners.',
      },
      {
        question: 'Can I enlarge an image without pixelation?',
        answer: 'You can increase pixel dimensions, but raster images will lose some sharpness. For best results, scale down or use original high-resolution captures.',
      },
      {
        question: 'What output formats can I export?',
        answer: 'You can export your resized image as PNG, JPEG, or WebP format with customizable output quality settings.',
      },
      {
        question: 'Is registration or payment required?',
        answer: 'No. The tool is 100% free with unlimited resize operations.',
      },
      {
        question: 'Can I download the resized image immediately?',
        answer: 'Yes. A single click initiates an instant download to your computer or mobile downloads folder.',
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
        question: 'What is the benefit of converting JPG to PNG?',
        answer: 'PNG uses lossless compression and supports 24-bit transparent alpha channels, making it ideal for graphics, logos, illustrations, and images requiring sharp edges.',
      },
      {
        question: 'Does converting JPG to PNG restore transparency?',
        answer: 'JPG files do not inherently store alpha transparency. Converting a JPG to PNG wraps the raster pixels in a lossless PNG container, allowing you to edit transparency in graphics software.',
      },
      {
        question: 'Is the conversion performed on a remote server?',
        answer: 'No. All color conversion and PNG encoding execute locally in your web browser. Your images remain strictly confidential on your computer.',
      },
      {
        question: 'Will the converted PNG file be larger than the JPG?',
        answer: 'Yes, in many cases PNG files are larger than JPGs because PNG uses lossless compression that preserves exact pixel values without DCT approximation.',
      },
      {
        question: 'Can I convert multiple JPG files?',
        answer: 'Yes. You can load and convert multiple images sequentially without upload wait queues or subscription gates.',
      },
      {
        question: 'Does it preserve image metadata?',
        answer: 'The conversion focuses on visual raster integrity. Camera EXIF data is stripped during canvas re-encoding, which actually enhances privacy and reduces unnecessary file weight.',
      },
      {
        question: 'Does this work on mobile phones?',
        answer: 'Yes. You can select photos directly from your iPhone photo library or Android gallery and save the PNG file instantly.',
      },
      {
        question: 'Is there a quality loss when converting to PNG?',
        answer: 'No. Canvas pixel rendering into PNG format is mathematically lossless, preserving every color coordinate of the source photo.',
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
        question: 'Why should I convert PNG to WebP?',
        answer: 'Google WebP offers superior compression, delivering file sizes 25% to 40% smaller than PNG while maintaining transparent alpha channels, accelerating page speed and boosting Core Web Vitals.',
      },
      {
        question: 'Does WebP support transparency?',
        answer: 'Yes. WebP fully supports 8-bit alpha transparency alongside both lossy and lossless compression modes.',
      },
      {
        question: 'Is my image uploaded to an external server?',
        answer: 'No. The conversion is handled client-side using browser-native WebP canvas encoders, ensuring immediate processing and total privacy.',
      },
      {
        question: 'Do all modern web browsers support WebP?',
        answer: 'Yes. WebP is natively supported in Google Chrome, Apple Safari (iOS 14+ and macOS Big Sur+), Mozilla Firefox, Microsoft Edge, and Opera.',
      },
      {
        question: 'Can I adjust WebP quality?',
        answer: 'Yes. You can configure the quality slider from 0.1 to 1.0 to achieve your target file size reduction.',
      },
      {
        question: 'Can I convert logos and graphic illustrations?',
        answer: 'Yes. WebP handles illustrations and user interface assets exceptionally well with sharp text rendering and minimal compression artifacts.',
      },
      {
        question: 'Is there a daily conversion limit?',
        answer: 'No. You can convert unlimited PNG files completely free of charge.',
      },
      {
        question: 'How fast is the conversion?',
        answer: 'Conversions take less than a second on modern devices because there are no upload or download network transfer delays.',
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
        answer: 'HEIC (High Efficiency Image Container) is Apple\'s default image format on iPhones and iPads. It offers high compression but cannot be opened natively on many Windows PCs and older applications.',
      },
      {
        question: 'How do I convert HEIC to JPG without software?',
        answer: 'Upload your .heic or .heif file into the ToolBox HEIC to JPG tool. It decodes the image in client memory and exports a universally compatible JPG file immediately.',
      },
      {
        question: 'Are my personal iPhone photos safe?',
        answer: 'Yes. Most online HEIC converters upload your personal photos to cloud servers. ToolBox uses client-side JavaScript decoders, ensuring your photos never leave your device.',
      },
      {
        question: 'Can I convert HEIC to PNG instead?',
        answer: 'Yes. You can select JPG or PNG as the target export format depending on whether you need universal compatibility or lossless rendering.',
      },
      {
        question: 'What causes HEIC conversion errors?',
        answer: 'Corrupted files or live photos with proprietary video components can sometimes cause issues. The tool handles standard iOS single-frame HEIC captures cleanly.',
      },
      {
        question: 'Does converting HEIC to JPG reduce photo quality?',
        answer: 'The converter uses high-quality JPEG quantization (~92% quality), ensuring that high-resolution details from your iPhone camera are visually indistinguishable.',
      },
      {
        question: 'Can I use this tool on a Windows computer?',
        answer: 'Yes. It runs inside Google Chrome, Microsoft Edge, or Firefox on any Windows 10/11 system without installing third-party codecs.',
      },
      {
        question: 'Is there any charge for converting HEIC photos?',
        answer: 'No. The tool is 100% free with no hidden subscriptions or watermark stamps.',
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
        question: 'What is a QR Code Generator?',
        answer: 'The QR Code Generator creates custom two-dimensional matrix barcodes that can be scanned by any smartphone camera to open URLs, text, Wi-Fi credentials, or contact info.',
      },
      {
        question: 'Do generated QR codes ever expire?',
        answer: 'No! QR codes generated on ToolBox are static barcodes. The data is encoded directly into the pixel pattern itself, meaning they work forever with zero scan limits.',
      },
      {
        question: 'Can I customize colors and size?',
        answer: 'Yes. You can customize the foreground color, background color, pixel resolution (from 150px to 600px), and quiet zone margin padding.',
      },
      {
        question: 'What error correction levels are supported?',
        answer: 'The tool supports L (7%), M (15%), Q (25%), and H (30%) Reed-Solomon error correction. Level H allows codes to remain readable even if up to 30% of the surface is obscured.',
      },
      {
        question: 'What export formats are available?',
        answer: 'You can download your QR code as a standard PNG image or as a vector SVG file for crisp, high-resolution physical printing on signs, flyers, and business cards.',
      },
      {
        question: 'Is my destination link or text sent to a tracking database?',
        answer: 'No. Many commercial QR sites reroute your scans through tracking redirect servers. ToolBox encodes your raw link directly into the matrix with zero tracking intermediates.',
      },
      {
        question: 'Can I use the QR code for commercial products?',
        answer: 'Yes. All QR codes you create are free for both personal and commercial use without licensing restrictions.',
      },
      {
        question: 'Can I generate Wi-Fi or contact QR codes?',
        answer: 'Yes. You can encode standard Wi-Fi network strings (WIFI:S:MySSID;T:WPA;P:MyPassword;;) or vCard information directly.',
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
        question: 'What is a Favicon?',
        answer: 'A favicon is the small branded icon displayed in browser tabs, bookmark bars, history lists, and mobile home screen shortcuts to identify your website.',
      },
      {
        question: 'What icon sizes does the Favicon Generator create?',
        answer: 'It creates standard 16x16 and 32x32 multi-resolution .ico files, a 180x180 Apple Touch Icon, and standard 192x192 / 512x512 PWA web manifest icons.',
      },
      {
        question: 'Can I upload a rectangular image?',
        answer: 'Yes. The generator allows you to position and crop rectangular images into perfect squares with transparent or solid background fills.',
      },
      {
        question: 'Is my brand logo uploaded to an external server?',
        answer: 'No. The canvas icon generation algorithm runs entirely in your browser sandbox, keeping your pre-launch logos and branding assets confidential.',
      },
      {
        question: 'Does it generate HTML code for my website header?',
        answer: 'Yes. The tool provides the exact HTML <link rel="icon"> tags required to paste into your website\'s <head> section for full cross-browser compatibility.',
      },
      {
        question: 'What source image format works best?',
        answer: 'A square PNG or SVG with a transparent background of at least 512x512 pixels yields the crispest favicons across all retina display resolutions.',
      },
      {
        question: 'Is the downloaded favicon free for commercial websites?',
        answer: 'Yes. You own 100% of the generated asset with zero watermarks or commercial restrictions.',
      },
      {
        question: 'Does it support dark mode favicons?',
        answer: 'You can create both light and dark variations and use CSS media queries (prefers-color-scheme) as shown in our integration snippet.',
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
        question: 'How does the Color Picker from Image work?',
        answer: 'You can upload any screenshot, design, or photo and click anywhere on the canvas to inspect and copy the exact pixel color value.',
      },
      {
        question: 'What color codes are provided?',
        answer: 'The color picker outputs HEX (#ffffff), RGB (rgb(255,255,255)), HSL (hsl(0, 0%, 100%)), and HSV formats with immediate one-click copy buttons.',
      },
      {
        question: 'Can I zoom into fine details?',
        answer: 'Yes. The interactive magnifier loupe enlarges the pixels surrounding your cursor, making it easy to select fine borders, typography strokes, and gradient transitions.',
      },
      {
        question: 'Are my design screenshots uploaded to a server?',
        answer: 'No. Image rendering and pixel data extraction (Canvas getImageData) occur strictly in local client memory.',
      },
      {
        question: 'Does it keep a history of recently picked colors?',
        answer: 'Yes. The tool stores your recent palette swatches in the current browser session so you can compare accent and background colors easily.',
      },
      {
        question: 'Can I test color contrast ratios?',
        answer: 'The tool displays relative luminance and dark/light contrast recommendations to assist with WCAG accessibility guidelines.',
      },
      {
        question: 'Can I pick colors on a touchscreen mobile device?',
        answer: 'Yes. You can touch and drag across the image on your phone to position the color crosshair accurately.',
      },
      {
        question: 'Is registration required?',
        answer: 'No. The tool is free with no registration or limits.',
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
        question: 'How does the PDF Compressor reduce document size?',
        answer: 'It optimizes stream objects, consolidates cross-reference tables, strips redundant font subsets, and packs internal dictionary streams using client-side pdf-lib stream processing.',
      },
      {
        question: 'Are my confidential legal or medical PDFs safe?',
        answer: 'Yes! Unlike other online PDF sites that upload your confidential documents to cloud servers, ToolBox processes the PDF entirely inside your local browser memory.',
      },
      {
        question: 'Does compression degrade text or vector sharpness?',
        answer: 'No. Vector lines, fonts, and text selections remain crisp and scalable. Only heavy embedded raster images and duplicate dictionary trees are optimized.',
      },
      {
        question: 'Is there an arbitrary file size limit?',
        answer: 'Processing is bounded only by your device\'s available RAM rather than cloud server upload caps. You can compress documents without queue delays.',
      },
      {
        question: 'Can I compress password-protected PDF files?',
        answer: 'You must remove or unlock the password before compressing, as encrypted streams cannot be safely repacked without proper authorization keys.',
      },
      {
        question: 'How much size reduction should I expect?',
        answer: 'Depending on how the PDF was originally authored (scanned raster images vs vector text), reductions range from 20% to over 60%.',
      },
      {
        question: 'Can I compress PDFs on a mobile browser?',
        answer: 'Yes. Modern mobile browsers running on iOS and Android have sufficient WebAssembly and memory power to compress standard PDF files.',
      },
      {
        question: 'Is there any watermark added to the compressed PDF?',
        answer: 'No. The output PDF remains 100% clean with zero watermarks or footer stamps.',
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
        question: 'How does the PDF Merger combine documents?',
        answer: 'The tool parses multiple PDF documents in client memory using pdf-lib, copies all page dictionaries in your chosen sequence, and binds them into a single consolidated PDF file.',
      },
      {
        question: 'Can I reorder the PDF files before merging?',
        answer: 'Yes. You can drag and drop or use arrow controls to organize the order of your documents before generating the final combined file.',
      },
      {
        question: 'Are my uploaded documents stored on a server?',
        answer: 'No. Your documents are read using the browser HTML5 File API and processed entirely in local device memory. No files are transmitted to any server.',
      },
      {
        question: 'Can I merge large PDF files?',
        answer: 'Yes. Because operations run in your device browser, merging is constrained only by your device RAM, allowing you to merge files that exceed cloud size limits.',
      },
      {
        question: 'Will bookmarks',
        answer: 'links, and forms be preserved?,Standard page content, text layers, vector diagrams, and fonts are preserved. Complex interactive form fields are flattened to maintain layout integrity.',
      },
      {
        question: 'Is there a limit on how many PDFs I can combine?',
        answer: 'No. You can add 2, 5, 10, or more PDF files into a single master document in one pass.',
      },
      {
        question: 'Does it work on Mac',
        answer: 'Windows, and Linux?,Yes. It runs inside modern web browsers (Chrome, Edge, Safari, Firefox) across any desktop or mobile operating system.',
      },
      {
        question: 'Is the service free?',
        answer: 'Yes, 100% free with no account registrations or subscription fees.',
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
        question: 'How does the PDF Splitter work?',
        answer: 'The PDF Splitter reads your multi-page document and extracts designated pages or page ranges (e.g. 1-3, 5, 8-10) into a new, standalone PDF file.',
      },
      {
        question: 'Can I split every page into separate individual PDFs?',
        answer: 'Yes. You can extract specific ranges or split all pages into individual single-page documents with automatic sequential naming.',
      },
      {
        question: 'Are my confidential documents private?',
        answer: 'Yes. The extraction algorithm operates entirely in client memory. No PDF pages are sent over the network.',
      },
      {
        question: 'Does splitting damage text quality or formatting?',
        answer: 'No. Pages are extracted as complete binary object trees, ensuring fonts, vector paths, and formatting remain identical to the original.',
      },
      {
        question: 'What syntax should I use for custom page ranges?',
        answer: 'You can use commas and hyphens (e.g., 1-4, 7, 9-12). The tool validates page boundaries to prevent out-of-range errors.',
      },
      {
        question: 'Can I split large book-length PDFs?',
        answer: 'Yes. As long as your browser has sufficient memory to hold the document, you can extract pages from manuals and reports consisting of hundreds of pages.',
      },
      {
        question: 'Can I use this tool on my smartphone?',
        answer: 'Yes. You can select PDF files from your device storage or cloud drive and extract pages on iOS and Android.',
      },
      {
        question: 'Is there any software installation required?',
        answer: 'No. It runs immediately in your browser without Adobe Acrobat or browser extension plugins.',
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
        question: 'How does the PDF to JPG Converter work?',
        answer: 'It renders each page of your PDF into an HTML5 Canvas using PDF.js and exports the rendered raster image as high-resolution JPG files.',
      },
      {
        question: 'What resolution / DPI are the converted JPGs?',
        answer: 'Pages are rendered at high-resolution display densities (150 to 300 DPI equivalent), ensuring that small text, diagrams, and signatures remain crisp and readable.',
      },
      {
        question: 'Are my PDF pages uploaded to an external server?',
        answer: 'No. Rendering and image rasterization happen entirely inside your local browser runtime. No document data leaves your computer.',
      },
      {
        question: 'Can I select which pages to convert?',
        answer: 'Yes. You can convert all pages or choose specific individual pages to download as JPG images.',
      },
      {
        question: 'How are multi-page conversions downloaded?',
        answer: 'You can download individual JPG images one by one or save the entire collection in an organized manner.',
      },
      {
        question: 'Can I convert scanned receipts and invoices?',
        answer: 'Yes. Scanned PDF documents convert into clean JPG images suitable for expense filing, accounting portals, or image editing.',
      },
      {
        question: 'Is there a page count limit?',
        answer: 'There are no artificial limits. Processing speed depends entirely on your device hardware.',
      },
      {
        question: 'Is registration or payment required?',
        answer: 'No. The tool is completely free with unlimited conversions.',
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
        question: 'How does the Age Calculator calculate chronological age?',
        answer: 'It measures the exact chronological interval between your date of birth and the target date (or current date), accounting for varying month lengths and leap years.',
      },
      {
        question: 'Does the calculator handle leap year birthdays (February 29)?',
        answer: 'Yes. For individuals born on February 29th, the calculator properly tracks elapsed milestones and recognizes common non-leap anniversary dates accurately.',
      },
      {
        question: 'What time units are displayed in the breakdown?',
        answer: 'The tool displays your age in years, months, and days, alongside equivalent total breakdowns in total months, total weeks, total days, total hours, and total minutes lived.',
      },
      {
        question: 'Can I calculate age at a future or past date?',
        answer: 'Yes. You can customize the \'Age at the Date of\' field to calculate how old someone was on a historic event or how old they will be at retirement.',
      },
      {
        question: 'Can it calculate the countdown to the next birthday?',
        answer: 'Yes. A dedicated widget calculates the exact number of days, hours, and minutes remaining until your upcoming birthday.',
      },
      {
        question: 'Is my birthdate saved or tracked?',
        answer: 'No. Calculations run in client JavaScript and are never stored or sent to any analytics database.',
      },
      {
        question: 'Can I use it on mobile?',
        answer: 'Yes. It works with native HTML5 mobile date pickers on iOS and Android devices.',
      },
      {
        question: 'Is it free to use?',
        answer: 'Yes, 100% free with unlimited calculations.',
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
        question: 'What percentage scenarios does this calculator solve?',
        answer: 'It solves four primary percentage questions: What is X% of Y, X is what percent of Y, What is the percentage increase or decrease from X to Y, and Calculate percentage change with negative values.',
      },
      {
        question: 'How is percentage change calculated?',
        answer: 'Percentage change uses the standard mathematical formula: ((New Value - Old Value) / |Old Value|) * 100. It shows whether the result is an increase or a decrease.',
      },
      {
        question: 'Can it calculate discounts and tax?',
        answer: 'Yes. You can find retail discounts by computing the percentage off a price, or calculate sales tax and tips easily.',
      },
      {
        question: 'Does it prevent division by zero errors?',
        answer: 'Yes. If zero is supplied as a denominator, the calculator displays a helpful validation message rather than crashing or showing NaN.',
      },
      {
        question: 'Does it provide step-by-step mathematical explanations?',
        answer: 'Yes. Each calculation card displays the explicit algebraic formula used so students and professionals can verify the math.',
      },
      {
        question: 'Is registration required?',
        answer: 'No. The calculator is completely free with immediate real-time results.',
      },
      {
        question: 'Are my calculations stored?',
        answer: 'No. Everything executes in client-side memory without tracking.',
      },
      {
        question: 'Can I copy the calculated results?',
        answer: 'Yes. One-click copy buttons let you transfer percentages and formulas directly to your spreadsheet or notes.',
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
        question: 'What is an EMI?',
        answer: 'An EMI (Equated Monthly Installment) is a fixed monthly payment made by a borrower to a lender on a specific date, covering both loan principal and accrued interest.',
      },
      {
        question: 'What mathematical formula is used for EMI calculation?',
        answer: 'We use the standard reducing-balance formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1], where P is Principal, r is periodic monthly interest rate, and n is the total number of monthly installments.',
      },
      {
        question: 'What loan types does this calculator support?',
        answer: 'It supports home loans, mortgage loans, car/auto loans, personal loans, and education loans with customizable tenure in years or months.',
      },
      {
        question: 'Can I view the year-by-year amortization schedule?',
        answer: 'Yes. An interactive amortization schedule displays the breakdown of principal paid, interest paid, and remaining loan balance for every year and month of the loan.',
      },
      {
        question: 'Can I download the amortization table as a CSV?',
        answer: 'Yes. You can export the complete month-by-month repayment schedule directly as a CSV file to open in Microsoft Excel or Google Sheets.',
      },
      {
        question: 'How does loan tenure impact total interest paid?',
        answer: 'A longer loan tenure reduces your monthly EMI amount but significantly increases the cumulative total interest paid over the life of the loan.',
      },
      {
        question: 'Does the calculator support 0% interest loans?',
        answer: 'Yes. In zero-interest promotional financing scenarios, the formula seamlessly divides principal evenly across the term without division-by-zero errors.',
      },
      {
        question: 'Are my financial numbers kept confidential?',
        answer: 'Yes. No loan amounts, interest rates, or financial data are ever sent to external lenders or marketing servers.',
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
        answer: 'Compound interest is interest calculated on the initial principal and on the accumulated interest of previous periods, allowing investments to grow exponentially over time.',
      },
      {
        question: 'What is the compound interest formula used?',
        answer: 'The calculator uses A = P(1 + r/n)^(nt) alongside periodic contribution formulas, where P is principal, r is annual interest rate, n is compounding frequency, and t is time in years.',
      },
      {
        question: 'What compounding frequencies are supported?',
        answer: 'You can calculate growth compounded annually, semi-annually, quarterly, monthly, or daily.',
      },
      {
        question: 'Can I include regular monthly or annual contributions?',
        answer: 'Yes. You can specify recurring deposits made at the beginning or end of each compounding period to simulate real-world retirement savings (401k, IRA, SIP).',
      },
      {
        question: 'Does the calculator provide year-by-year accumulation tables?',
        answer: 'Yes. An interactive schedule displays starting balance, annual contributions, interest earned that year, and ending balance with downloadable CSV capability.',
      },
      {
        question: 'How does compounding frequency affect total return?',
        answer: 'More frequent compounding (e.g. monthly vs annually) generates slightly higher total returns because interest is credited and reinvested sooner.',
      },
      {
        question: 'Can I adjust for inflation?',
        answer: 'The tool displays nominal future values and provides clear metrics on total principal invested versus total compound interest generated.',
      },
      {
        question: 'Is this calculator private and free?',
        answer: 'Yes. It runs entirely in your browser with zero data logging, no sign-ups, and unlimited calculations.',
      },
    ],
    metaTitle: 'Free Compound Interest Calculator — Forecast Savings & Investments',
    metaDescription:
      'Calculate compound interest and future investment growth with regular deposits, compounding frequency options, and year-by-year schedules.',
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

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
