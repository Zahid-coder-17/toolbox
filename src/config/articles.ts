import { ToolCategory } from './tools';

export interface ArticleSection {
  heading: string;
  subheading?: string;
  content: string[];
  keyTakeaway?: string;
}

export interface ArticleDefinition {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    role: string;
  };
  readTimeMinutes: number;
  primaryKeyword: string;
  secondaryKeywords: string[];
  relatedToolIds: string[];
  sections: ArticleSection[];
}

export const ARTICLES: ArticleDefinition[] = [
  {
    slug: 'how-to-compress-images-without-losing-quality',
    title: 'How to Compress Images Without Losing Quality: WebP vs. PNG vs. JPEG',
    description:
      'Learn how to dramatically reduce image file size by 40% to 80% without visible pixelation. Understand lossy vs. lossless compression and next-gen WebP formats.',
    category: 'image',
    datePublished: '2026-11-17T08:00:00Z',
    dateModified: '2026-11-17T08:00:00Z',
    author: {
      name: 'ToolBox Engineering Team',
      role: 'Web Performance Specialists',
    },
    readTimeMinutes: 6,
    primaryKeyword: 'how to compress images without losing quality',
    secondaryKeywords: ['image compression guide', 'png to webp file size', 'lossless vs lossy compression'],
    relatedToolIds: ['image-compressor', 'png-to-webp', 'image-resizer'],
    sections: [
      {
        heading: 'Why Image Optimization Directly Dictates Core Web Vitals',
        content: [
          'Images consistently represent over 60% of total web page weight across global internet traffic. When uncompressed photos are delivered to mobile visitors, Largest Contentful Paint (LCP) times degrade, bounce rates surge, and search ranking signals suffer.',
          'Effective image compression is not about indiscriminately reducing resolution; it is about eliminating redundant high-frequency color variations and superfluous EXIF camera metadata while preserving crisp edges and color contrast.',
        ],
        keyTakeaway: 'Uncompressed images degrade mobile LCP. True optimization removes metadata and invisible color redundancies without degrading visible edges.',
      },
      {
        heading: 'Lossy vs. Lossless Compression: Finding the Visual Equilibrium',
        content: [
          'Lossless compression (such as PNG optimization) reorganizes binary pixel data using Deflate algorithms without deleting any color information. Every single pixel remains mathematically identical, but file size reductions are typically capped at 15% to 30%.',
          'Lossy compression (such as JPEG and WebP) intelligently approximates subtle color nuances that the human eye cannot distinguish under standard display lighting. Setting quality to 80%–85% typically reduces file size by 60% to 75% with zero perceptible visual difference.',
        ],
        keyTakeaway: 'Lossless is ideal for logos with transparent backgrounds. Lossy at 80%–85% quality is optimal for hero photography and editorial visuals.',
      },
      {
        heading: 'Why Next-Gen WebP is the Modern Web Standard',
        content: [
          'Developed by Google, the WebP format supports both lossy and lossless modes alongside 24-bit transparent alpha channels. Compared to PNGs, WebP files are consistently 25% to 40% smaller while maintaining identical alpha transparency.',
          'All modern browsers—including Safari on iOS and macOS, Google Chrome, Mozilla Firefox, and Microsoft Edge—fully support native WebP rendering.',
        ],
      },
      {
        heading: 'Step-by-Step Guide: Optimizing Images Client-Side in Your Browser',
        content: [
          '1. Drop your image into the ToolBox Image Compressor.',
          '2. Adjust the compression slider to approximately 80% to 85% to target sub-150KB output.',
          '3. Check the real-time preview to ensure typography and subject borders remain sharp.',
          '4. Convert the output to WebP via the PNG to WebP tool if maximum bandwidth reduction is desired.',
          '5. Download your compressed file instantly with zero server uploads.',
        ],
        keyTakeaway: 'Using client-side browser compression protects private graphics from third-party server logging.',
      },
    ],
  },
  {
    slug: 'guide-to-merging-pdfs-securely',
    title: 'Guide to Merging PDFs Securely: Why Browser-First Processing Protects Confidential Documents',
    description:
      'Discover how client-side PDF merging ensures 100% confidentiality for contracts, financial audits, and medical records by eliminating third-party cloud uploads.',
    category: 'pdf',
    datePublished: '2026-11-17T08:00:00Z',
    dateModified: '2026-11-17T08:00:00Z',
    author: {
      name: 'ToolBox Security Team',
      role: 'Document Security Analysts',
    },
    readTimeMinutes: 5,
    primaryKeyword: 'how to merge pdfs securely',
    secondaryKeywords: ['private pdf merger', 'combine pdf without upload', 'confidential document processing'],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'pdf-compressor'],
    sections: [
      {
        heading: 'The Hidden Privacy Hazard of Cloud-Based PDF Tools',
        content: [
          'Millions of professionals regularly merge sensitive invoices, NDA agreements, patient healthcare records, and tax returns using conventional online PDF converters. However, standard online tools require transmitting your complete PDF byte streams to an unverified third-party cloud server.',
          'Even when websites promise to "delete files after 1 hour," documents reside in transient server caches, unencrypted disk arrays, and network logs—violating compliance regulations like HIPAA, GDPR, and enterprise confidentiality agreements.',
        ],
        keyTakeaway: 'Uploading sensitive contracts to cloud conversion servers creates irreversible compliance and privacy liabilities.',
      },
      {
        heading: 'How Client-Side PDF Processing Works (WebAssembly & pdf-lib)',
        content: [
          'Modern web browsers possess powerful memory sandboxes and hardware acceleration. Using compiled JavaScript engines and the pdf-lib library, ToolBox reads your PDF binary structure directly from your local filesystem through the HTML5 File API.',
          'Pages are extracted, re-ordered, and bound into a single PDF document inside your computer RAM. No network sockets are opened, and not a single byte of your document is sent over the internet.',
        ],
        keyTakeaway: 'Client-side processing binds PDF pages entirely in device RAM—guaranteeing zero external data exposure.',
      },
      {
        heading: 'How to Combine Multiple PDF Files in ToolBox in 3 Steps',
        content: [
          '1. Select or drag multiple PDF files into the ToolBox PDF Merger.',
          '2. Reorder your documents using the interactive drag controls to arrange pages in your intended sequence.',
          '3. Click "Merge PDFs" to generate the unified document immediately in local memory and save it to your downloads.',
        ],
      },
    ],
  },
  {
    slug: 'understanding-loan-emi-amortization',
    title: 'Understanding Loan EMI & Amortization: The Reducing Balance Formula Explained',
    description:
      'Learn how bank home loan and car loan EMIs are calculated. Master the reducing balance interest formula, amortization tables, and how to save thousands in interest.',
    category: 'calculators',
    datePublished: '2026-11-17T08:00:00Z',
    dateModified: '2026-11-17T08:00:00Z',
    author: {
      name: 'ToolBox Quantitative Research',
      role: 'Financial Systems Analyst',
    },
    readTimeMinutes: 7,
    primaryKeyword: 'how is emi calculated formula',
    secondaryKeywords: ['reducing balance emi formula', 'loan amortization table', 'how to reduce mortgage interest'],
    relatedToolIds: ['emi-calculator', 'compound-interest-calculator', 'percentage-calculator'],
    sections: [
      {
        heading: 'What is an Equated Monthly Installment (EMI)?',
        content: [
          'An EMI is an equal, pre-scheduled payment made each month to clear an outstanding loan balance over a predetermined tenure. While the overall monthly cash outflow remains constant throughout the loan term, the internal division between principal and interest shifts dramatically every month.',
          'During the opening third of a long-term mortgage, over 70% of each monthly installment goes directly toward paying interest charges. Only as the outstanding principal reduces does the interest portion decrease, allowing larger chunks of principal to be retired.',
        ],
        keyTakeaway: 'EMIs are front-loaded with interest charges. Paying extra principal early in the loan yields exponential interest savings.',
      },
      {
        heading: 'The Mathematical Reducing Balance Formula',
        content: [
          'Institutional banks worldwide compute reducing balance loan EMIs using the standard algebraic equation: E = [P * r * (1+r)^n] / [(1+r)^n - 1]',
          'Where P = Principal loan amount, r = Monthly interest rate (annual interest rate / 12 / 100), and n = Total number of monthly installments (years * 12).',
          'Unlike misleading flat-rate calculations that charge interest on the original loan amount throughout the full term, the reducing balance method recalculates interest only on the remaining unpaid debt.',
        ],
        keyTakeaway: 'Always insist on reducing-balance quotes. Flat-rate loans cost nearly double the effective interest rate over a multi-year term.',
      },
      {
        heading: 'How to Read an Amortization Schedule & Accelerate Payoff',
        content: [
          'An amortization schedule is an itemized table displaying payment numbers, beginning balance, scheduled monthly payment, principal component, interest component, and ending balance.',
          'By making just one additional EMI payment per year or rounding up your monthly transfer, you can shave 4 to 7 years off a 25-year home mortgage and save tens of thousands in cumulative interest payments.',
        ],
      },
    ],
  },
  {
    slug: 'calculating-reading-time-and-speaking-speed',
    title: 'Calculating Reading Time and Speaking Speed: The Science of Words Per Minute',
    description:
      'Master the scientific formulas behind silent reading speeds and spoken speech timing. Learn how to accurately estimate durations for speeches, articles, and podcasts.',
    category: 'text',
    datePublished: '2026-11-17T08:00:00Z',
    dateModified: '2026-11-17T08:00:00Z',
    author: {
      name: 'ToolBox Editorial Team',
      role: 'Content Strategists & Linguists',
    },
    readTimeMinutes: 5,
    primaryKeyword: 'how to calculate reading time',
    secondaryKeywords: ['speaking speed words per minute', 'speech duration calculator', 'words to minutes speech'],
    relatedToolIds: ['word-counter', 'character-counter', 'text-diff-checker'],
    sections: [
      {
        heading: 'Silent Reading Rates: The Global 200 WPM Benchmark',
        content: [
          'Extensive cognitive psycholinguistic research across English-speaking adults confirms that the average silent reading rate for non-technical prose is between 200 and 250 words per minute (WPM). Technical papers, legal briefs, and dense code snippets lower this rate to 120–160 WPM.',
          'Publishing platforms like Medium and Substack utilize a baseline of 200 to 225 WPM to inform readers of article commitment before they click, significantly improving dwell time and engagement.',
        ],
        keyTakeaway: 'Standard web reading time is calibrated at 200 words per minute. Dense technical writing drops to ~140 WPM.',
      },
      {
        heading: 'Speaking Speed: Why Presentations Require 130 WPM',
        content: [
          'Speaking aloud introduces physiological pacing, breath breaks, comedic or dramatic pauses, and auditory comprehension thresholds. While an enthusiastic conversationalist might speak at 160 WPM, effective keynote speakers, podcasters, and trial attorneys maintain a cadence of 120 to 140 WPM.',
          'Delivering a 1,000-word speech at 130 WPM will take approximately 7 minutes and 40 seconds. Planning your speech using silent reading speeds will cause you to severely exceed conference presentation time limits.',
        ],
        keyTakeaway: 'Never use reading time for speeches. A 1,000-word script takes 5 minutes to read silently, but nearly 8 minutes to deliver on stage.',
      },
      {
        heading: 'How to Time Your Scripts with ToolBox Word Counter',
        content: [
          '1. Paste your draft script into the ToolBox Word Counter.',
          '2. Check the real-time Reading duration meter (~200 WPM) and Speaking duration meter (~130 WPM) at the top of the editor.',
          '3. Review the Keyword Density table to ensure key phrases are balanced without awkward repetition.',
          '4. Download the finalized script or copy it directly into your teleprompter.',
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ArticleDefinition | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: ToolCategory): ArticleDefinition[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getRelatedArticlesForTool(toolId: string): ArticleDefinition[] {
  return ARTICLES.filter((a) => a.relatedToolIds.includes(toolId));
}
