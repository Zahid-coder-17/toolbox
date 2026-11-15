'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Text Tools
const WordCounter = dynamic(() => import('@/components/tools/text/WordCounter').then((m) => m.WordCounter));
const CharacterCounter = dynamic(() => import('@/components/tools/text/CharacterCounter').then((m) => m.CharacterCounter));
const CaseConverter = dynamic(() => import('@/components/tools/text/CaseConverter').then((m) => m.CaseConverter));
const JsonFormatter = dynamic(() => import('@/components/tools/text/JsonFormatter').then((m) => m.JsonFormatter));
const Base64Tool = dynamic(() => import('@/components/tools/text/Base64Tool').then((m) => m.Base64Tool));
const TextDiffChecker = dynamic(() => import('@/components/tools/text/TextDiffChecker').then((m) => m.TextDiffChecker));
const SlugGenerator = dynamic(() => import('@/components/tools/text/SlugGenerator').then((m) => m.SlugGenerator));
const UuidGenerator = dynamic(() => import('@/components/tools/text/UuidGenerator').then((m) => m.UuidGenerator));

// Image Tools
const ImageCompressor = dynamic(() => import('@/components/tools/image/ImageCompressor').then((m) => m.ImageCompressor));
const ImageResizer = dynamic(() => import('@/components/tools/image/ImageResizer').then((m) => m.ImageResizer));
const JpgToPng = dynamic(() => import('@/components/tools/image/JpgToPng').then((m) => m.JpgToPng));
const PngToWebp = dynamic(() => import('@/components/tools/image/PngToWebp').then((m) => m.PngToWebp));
const HeicToJpg = dynamic(() => import('@/components/tools/image/HeicToJpg').then((m) => m.HeicToJpg));
const QrCodeGenerator = dynamic(() => import('@/components/tools/image/QrCodeGenerator').then((m) => m.QrCodeGenerator));
const FaviconGenerator = dynamic(() => import('@/components/tools/image/FaviconGenerator').then((m) => m.FaviconGenerator));
const ColorPicker = dynamic(() => import('@/components/tools/image/ColorPicker').then((m) => m.ColorPicker));

// PDF Tools
const PdfCompressor = dynamic(() => import('@/components/tools/pdf/PdfCompressor').then((m) => m.PdfCompressor));
const PdfMerger = dynamic(() => import('@/components/tools/pdf/PdfMerger').then((m) => m.PdfMerger));
const PdfSplitter = dynamic(() => import('@/components/tools/pdf/PdfSplitter').then((m) => m.PdfSplitter));
const PdfToJpg = dynamic(() => import('@/components/tools/pdf/PdfToJpg').then((m) => m.PdfToJpg));

// Calculator Tools
const AgeCalculator = dynamic(() => import('@/components/tools/calculators/AgeCalculator').then((m) => m.AgeCalculator));
const PercentageCalculator = dynamic(() => import('@/components/tools/calculators/PercentageCalculator').then((m) => m.PercentageCalculator));
const EmiCalculator = dynamic(() => import('@/components/tools/calculators/EmiCalculator').then((m) => m.EmiCalculator));
const CompoundInterestCalculator = dynamic(() => import('@/components/tools/calculators/CompoundInterestCalculator').then((m) => m.CompoundInterestCalculator));

export function ToolResolver({ slug }: { slug: string }) {
  switch (slug) {
    // Text
    case 'word-counter':
      return <WordCounter />;
    case 'character-counter':
      return <CharacterCounter />;
    case 'case-converter':
      return <CaseConverter />;
    case 'json-formatter':
      return <JsonFormatter />;
    case 'base64-encoder-decoder':
      return <Base64Tool />;
    case 'text-diff-checker':
      return <TextDiffChecker />;
    case 'slug-generator':
      return <SlugGenerator />;
    case 'uuid-generator':
      return <UuidGenerator />;

    // Image
    case 'image-compressor':
      return <ImageCompressor />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'jpg-to-png':
      return <JpgToPng />;
    case 'png-to-webp':
      return <PngToWebp />;
    case 'heic-to-jpg':
      return <HeicToJpg />;
    case 'qr-code-generator':
      return <QrCodeGenerator />;
    case 'favicon-generator':
      return <FaviconGenerator />;
    case 'color-picker':
      return <ColorPicker />;

    // PDF
    case 'pdf-compressor':
      return <PdfCompressor />;
    case 'pdf-merger':
      return <PdfMerger />;
    case 'pdf-splitter':
      return <PdfSplitter />;
    case 'pdf-to-jpg':
      return <PdfToJpg />;

    // Calculators
    case 'age-calculator':
      return <AgeCalculator />;
    case 'percentage-calculator':
      return <PercentageCalculator />;
    case 'emi-calculator':
      return <EmiCalculator />;
    case 'compound-interest-calculator':
      return <CompoundInterestCalculator />;

    default:
      return <div>Tool not found</div>;
  }
}
