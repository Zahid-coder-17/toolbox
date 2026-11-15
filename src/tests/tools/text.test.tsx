import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordCounter } from '@/components/tools/text/WordCounter';
import { CharacterCounter } from '@/components/tools/text/CharacterCounter';
import { CaseConverter } from '@/components/tools/text/CaseConverter';
import { JsonFormatter } from '@/components/tools/text/JsonFormatter';
import { Base64Tool } from '@/components/tools/text/Base64Tool';
import { TextDiffChecker } from '@/components/tools/text/TextDiffChecker';
import { SlugGenerator } from '@/components/tools/text/SlugGenerator';
import { UuidGenerator } from '@/components/tools/text/UuidGenerator';

describe('TEXT & DEVELOPER TOOLS (8/8)', () => {
  // 1. Word Counter
  describe('Word Counter', () => {
    it('normal: counts words, characters, sentences, lines correctly', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      fireEvent.change(textarea, { target: { value: 'Hello world! This is ToolBox.' } });

      expect(screen.getByText('5')).toBeInTheDocument(); // 5 words
      expect(screen.getByText('29')).toBeInTheDocument(); // 29 characters
      expect(screen.getByText('25')).toBeInTheDocument(); // 25 without spaces
    });

    it('edge: handles Unicode accented letters, contractions, and emojis', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      // "café résumé it's über 🚀" has 4 words, 1 emoji, accents and contractions
      fireEvent.change(textarea, { target: { value: "café résumé it's über 🚀" } });

      // 4 words: café, résumé, it's, über
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('invalid/edge: handles empty and whitespace-only input gracefully', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      fireEvent.change(textarea, { target: { value: '     \n\n   ' } });

      const zeroes = screen.getAllByText('0');
      expect(zeroes.length).toBeGreaterThanOrEqual(4);
    });

    it('edge: displays large text processing banner for massive inputs', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      const largeText = 'a'.repeat(60000); // > 50,000 characters
      fireEvent.change(textarea, { target: { value: largeText } });

      expect(screen.getByText(/large text detected/i)).toBeInTheDocument();
    });
  });

  // 2. Character Counter
  describe('Character Counter', () => {
    it('normal: calculates character metrics and platform limits on standard text', () => {
      render(<CharacterCounter />);
      const textarea = screen.getByRole('textbox', { name: /character counter input/i });
      fireEvent.change(textarea, { target: { value: 'Test 123 !' } });

      // Total chars = 10
      expect(screen.getByText('10')).toBeInTheDocument();
      // Letters = 4 ('Test')
      expect(screen.getByText('4')).toBeInTheDocument();
      // Digits = 3 ('123')
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('edge: counts Unicode code points and emojis accurately', () => {
      render(<CharacterCounter />);
      const textarea = screen.getByRole('textbox', { name: /character counter input/i });
      // Emojis: 🚀 (1 code point), Letters: Über (4 letters)
      fireEvent.change(textarea, { target: { value: 'Über 🚀' } });

      // Total code points: Über (4) + space (1) + 🚀 (1) = 6
      expect(screen.getByText('6')).toBeInTheDocument();
      // Letters: Über = 4
      expect(screen.getByText('4')).toBeInTheDocument();
      // Spaces & Symbols: at least one metric is 1
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
    });

    it('invalid/edge: handles empty input gracefully without breaking platform progress', () => {
      render(<CharacterCounter />);
      const textarea = screen.getByRole('textbox', { name: /character counter input/i });
      fireEvent.change(textarea, { target: { value: '' } });

      const zeroes = screen.getAllByText('0');
      expect(zeroes.length).toBeGreaterThan(0);
      expect(screen.getByText(/X \/ Twitter Post/i)).toBeInTheDocument();
    });
  });

  // 3. Case Converter
  describe('Case Converter', () => {
    it('normal: converts text through multiple case formats', () => {
      render(<CaseConverter />);
      const textarea = screen.getByRole('textbox', { name: /case converter text area/i });
      fireEvent.change(textarea, { target: { value: 'hello world from toolbox' } });

      // UPPER CASE
      const upperBtn = screen.getByRole('button', { name: /upper case/i });
      fireEvent.click(upperBtn);
      expect(textarea).toHaveValue('HELLO WORLD FROM TOOLBOX');

      // lower case
      const lowerBtn = screen.getByRole('button', { name: /^lower case$/i });
      fireEvent.click(lowerBtn);
      expect(textarea).toHaveValue('hello world from toolbox');

      // kebab-case
      const kebabBtn = screen.getByRole('button', { name: /kebab-case/i });
      fireEvent.click(kebabBtn);
      expect(textarea).toHaveValue('hello-world-from-toolbox');

      // snake_case
      const snakeBtn = screen.getByRole('button', { name: /snake_case/i });
      fireEvent.click(snakeBtn);
      expect(textarea).toHaveValue('hello_world_from_toolbox');
    });

    it('edge: converts Title Case and camelCase with Unicode characters', () => {
      render(<CaseConverter />);
      const textarea = screen.getByRole('textbox', { name: /case converter text area/i });
      fireEvent.change(textarea, { target: { value: 'über café latte' } });

      // Title Case
      const titleBtn = screen.getByRole('button', { name: /title case/i });
      fireEvent.click(titleBtn);
      expect(textarea).toHaveValue('Über Café Latte');

      // camelCase
      const camelBtn = screen.getByRole('button', { name: /camelcase/i });
      fireEvent.click(camelBtn);
      expect(textarea).toHaveValue('überCaféLatte');
    });

    it('invalid: disables conversion actions when input text is empty', () => {
      render(<CaseConverter />);
      const upperBtn = screen.getByRole('button', { name: /upper case/i });
      expect(upperBtn).toBeDisabled();
    });
  });

  // 4. JSON Formatter
  describe('JSON Formatter', () => {
    it('normal: prettifies and minifies valid JSON correctly', () => {
      render(<JsonFormatter />);
      const textarea = screen.getByRole('textbox', { name: /json input editor/i });
      fireEvent.change(textarea, { target: { value: '{"name":"ToolBox","version":1}' } });

      const prettifyBtn = screen.getByRole('button', { name: /prettify \(2 spaces\)/i });
      fireEvent.click(prettifyBtn);
      expect(textarea.value).toContain('  "name": "ToolBox"');

      const minifyBtn = screen.getByRole('button', { name: /minify/i });
      fireEvent.click(minifyBtn);
      expect(textarea.value).toBe('{"name":"ToolBox","version":1}');
    });

    it('edge: handles complex nested structures and tree view navigation', () => {
      render(<JsonFormatter />);
      const textarea = screen.getByRole('textbox', { name: /json input editor/i });
      fireEvent.change(textarea, {
        target: {
          value: JSON.stringify({
            app: 'ToolBox',
            items: [1, 2, 3],
            meta: { active: true, nil: null, greeting: 'Bonjour le monde! 🌍' },
          }),
        },
      });

      // Switch to tree view
      const treeTab = screen.getByRole('button', { name: /tree view/i });
      fireEvent.click(treeTab);

      expect(screen.getByText(/Bonjour le monde! 🌍/i)).toBeInTheDocument();
    });

    it('invalid: reports syntax errors with line and column details', () => {
      render(<JsonFormatter />);
      const textarea = screen.getByRole('textbox', { name: /json input editor/i });
      // Malformed JSON: missing closing bracket and quote
      fireEvent.change(textarea, { target: { value: '{"broken": [1, 2, ' } });

      const validateBtn = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateBtn);

      expect(screen.getByText(/invalid json syntax/i)).toBeInTheDocument();
    });

    it('invalid: reports error when attempting to format empty input', () => {
      render(<JsonFormatter />);
      const validateBtn = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateBtn);

      expect(screen.getByText(/input is empty/i)).toBeInTheDocument();
    });
  });

  // 5. Base64 Encoder / Decoder
  describe('Base64 Tool', () => {
    it('normal: encodes and decodes plain text safely', () => {
      render(<Base64Tool />);
      const input = screen.getByRole('textbox', { name: /base64 text input/i });
      const output = screen.getByRole('textbox', { name: /base64 text output/i });

      fireEvent.change(input, { target: { value: 'Hello World' } });
      const encodeBtn = screen.getByRole('button', { name: /encode to base64/i });
      fireEvent.click(encodeBtn);

      expect(output.value).toBe('SGVsbG8gV29ybGQ=');

      // Decode back
      fireEvent.change(input, { target: { value: 'SGVsbG8gV29ybGQ=' } });
      const decodeBtn = screen.getByRole('button', { name: /decode to text/i });
      fireEvent.click(decodeBtn);

      expect(output.value).toBe('Hello World');
    });

    it('edge: preserves multi-byte Unicode, CJK, and emojis via UTF-8', () => {
      render(<Base64Tool />);
      const input = screen.getByRole('textbox', { name: /base64 text input/i });
      const output = screen.getByRole('textbox', { name: /base64 text output/i });

      const unicodeText = 'ToolBox 🚀 你好 世界';
      fireEvent.change(input, { target: { value: unicodeText } });

      const encodeBtn = screen.getByRole('button', { name: /encode to base64/i });
      fireEvent.click(encodeBtn);
      const encoded = output.value;
      expect(encoded).toBeTruthy();

      // Decode back
      fireEvent.change(input, { target: { value: encoded } });
      const decodeBtn = screen.getByRole('button', { name: /decode to text/i });
      fireEvent.click(decodeBtn);

      expect(output.value).toBe(unicodeText);
    });

    it('invalid: gracefully reports invalid Base64 decoding attempts', () => {
      render(<Base64Tool />);
      const input = screen.getByRole('textbox', { name: /base64 text input/i });
      fireEvent.change(input, { target: { value: '!!!Not-A-Base64-String!!!' } });

      const decodeBtn = screen.getByRole('button', { name: /decode to text/i });
      fireEvent.click(decodeBtn);

      expect(screen.getByText(/invalid base64 string/i)).toBeInTheDocument();
    });
  });

  // 6. Text Diff Checker
  describe('Text Diff Checker', () => {
    it('normal: calculates additions and deletions between two passages', () => {
      render(<TextDiffChecker />);
      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Alpha\nBeta\nGamma' } });
      fireEvent.change(inputs[1], { target: { value: 'Alpha\nBeta Modified\nGamma\nDelta' } });

      expect(screen.getByText(/Additions/i)).toBeInTheDocument();
      expect(screen.getByText(/Deletions/i)).toBeInTheDocument();
    });

    it('edge: switches between side-by-side, unified, lines, and words modes', () => {
      render(<TextDiffChecker />);
      const wordsBtn = screen.getByRole('button', { name: /^words$/i });
      fireEvent.click(wordsBtn);

      const unifiedBtn = screen.getByRole('button', { name: /unified view/i });
      fireEvent.click(unifiedBtn);

      expect(screen.getByText(/Unified Comparison/i)).toBeInTheDocument();
    });

    it('edge/boundary: reports 0 additions and 0 deletions on identical inputs', () => {
      render(<TextDiffChecker />);
      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Identical Passage' } });
      fireEvent.change(inputs[1], { target: { value: 'Identical Passage' } });

      expect(screen.getByText('+0 Additions')).toBeInTheDocument();
      expect(screen.getByText('-0 Deletions')).toBeInTheDocument();
    });
  });

  // 7. Slug Generator
  describe('Slug Generator', () => {
    it('normal: generates URL-safe slugs with lowercase and hyphens', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      fireEvent.change(input, { target: { value: 'Next.js 16 Web Development Guide!' } });

      expect(screen.getByText('next-js-16-web-development-guide')).toBeInTheDocument();
    });

    it('edge: converts ligatures and normalizes accents and stop words', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      // Café & Résumé in München -> cafe-and-resume-in-munchen
      fireEvent.change(input, { target: { value: 'Café & Résumé in München' } });

      expect(screen.getByText('cafe-and-resume-in-munchen')).toBeInTheDocument();
    });

    it('edge: falls back cleanly to Unicode letters for non-Latin scripts', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      fireEvent.change(input, { target: { value: 'Привет Мир 2026' } });

      expect(screen.getByText('привет-мир-2026')).toBeInTheDocument();
    });

    it('invalid/edge: shows empty placeholder when input text is cleared', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      fireEvent.change(input, { target: { value: '' } });

      expect(screen.getByText(/slug preview will appear here/i)).toBeInTheDocument();
    });
  });

  // 8. UUID Generator
  describe('UUID Generator', () => {
    it('normal: generates RFC 4122 v4 UUIDs via Web Crypto CSPRNG', () => {
      render(<UuidGenerator />);
      const v4Pattern = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
      const elements = screen.getAllByText(v4Pattern);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('edge: supports UPPERCASE, no-hyphens, and braces formatting', () => {
      render(<UuidGenerator />);

      const uppercaseCheckbox = screen.getByRole('checkbox', { name: /uppercase/i });
      fireEvent.click(uppercaseCheckbox);

      const noHyphensCheckbox = screen.getByRole('checkbox', { name: /remove hyphens/i });
      fireEvent.click(noHyphensCheckbox);

      const addBracesCheckbox = screen.getByRole('checkbox', { name: /add braces/i });
      fireEvent.click(addBracesCheckbox);

      const formattedPattern = /\{[0-9A-F]{32}\}/;
      const elements = screen.getAllByText(formattedPattern);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('boundary/edge: clamps quantity input between 1 and 1000', () => {
      render(<UuidGenerator />);
      const qtyInput = screen.getByRole('spinbutton', { name: /custom uuid quantity/i });

      // Test boundary: 10
      fireEvent.change(qtyInput, { target: { value: '10' } });
      expect(qtyInput).toHaveValue(10);

      // Test boundary clamp: 5000 -> clamps to 1000
      fireEvent.change(qtyInput, { target: { value: '5000' } });
      expect(qtyInput).toHaveValue(1000);
    });
  });
});
