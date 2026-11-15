import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WordCounter } from '@/components/tools/text/WordCounter';
import { CharacterCounter } from '@/components/tools/text/CharacterCounter';
import { CaseConverter } from '@/components/tools/text/CaseConverter';
import { JsonFormatter } from '@/components/tools/text/JsonFormatter';
import { Base64Tool } from '@/components/tools/text/Base64Tool';
import { TextDiffChecker } from '@/components/tools/text/TextDiffChecker';
import { SlugGenerator } from '@/components/tools/text/SlugGenerator';
import { UuidGenerator } from '@/components/tools/text/UuidGenerator';

describe('TEXT TOOLS (8/8)', () => {
  // 1. Word Counter
  describe('Word Counter', () => {
    it('counts words and characters correctly on valid input', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      fireEvent.change(textarea, { target: { value: 'Hello world! This is ToolBox.' } });

      expect(screen.getByText('5')).toBeInTheDocument(); // 5 words
      expect(screen.getByText('29')).toBeInTheDocument(); // 29 characters
    });

    it('handles empty input gracefully', () => {
      render(<WordCounter />);
      const textarea = screen.getByRole('textbox', { name: /text editor for word counting/i });
      fireEvent.change(textarea, { target: { value: '   ' } });

      const zeroes = screen.getAllByText('0');
      expect(zeroes.length).toBeGreaterThan(0);
    });
  });

  // 2. Character Counter
  describe('Character Counter', () => {
    it('calculates character categories and social media limits on valid input', () => {
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

    it('handles boundary and empty input correctly', () => {
      render(<CharacterCounter />);
      const textarea = screen.getByRole('textbox', { name: /character counter input/i });
      fireEvent.change(textarea, { target: { value: '' } });

      const zeroes = screen.getAllByText('0');
      expect(zeroes.length).toBeGreaterThan(0);
    });
  });

  // 3. Case Converter
  describe('Case Converter', () => {
    it('converts cases accurately on valid text', () => {
      render(<CaseConverter />);
      const textarea = screen.getByRole('textbox', { name: /case converter text area/i });
      fireEvent.change(textarea, { target: { value: 'hello world from toolbox' } });

      // Click UPPER CASE
      const upperBtn = screen.getByRole('button', { name: /upper case/i });
      fireEvent.click(upperBtn);
      expect(textarea).toHaveValue('HELLO WORLD FROM TOOLBOX');

      // Click kebab-case
      const kebabBtn = screen.getByRole('button', { name: /kebab-case/i });
      fireEvent.click(kebabBtn);
      expect(textarea).toHaveValue('hello-world-from-toolbox');
    });

    it('disables conversion actions when input is empty', () => {
      render(<CaseConverter />);
      const upperBtn = screen.getByRole('button', { name: /upper case/i });
      expect(upperBtn).toBeDisabled();
    });
  });

  // 4. JSON Formatter
  describe('JSON Formatter', () => {
    it('prettifies and minifies valid JSON correctly', () => {
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

    it('detects and flags invalid JSON syntax error with line details', () => {
      render(<JsonFormatter />);
      const textarea = screen.getByRole('textbox', { name: /json input editor/i });
      // Invalid JSON: missing closing brace and quote
      fireEvent.change(textarea, { target: { value: '{"name": "ToolBox"' } });

      const validateBtn = screen.getByRole('button', { name: /validate/i });
      fireEvent.click(validateBtn);

      expect(screen.getByText(/invalid json syntax/i)).toBeInTheDocument();
    });
  });

  // 5. Base64 Encoder / Decoder
  describe('Base64 Tool', () => {
    it('encodes and decodes UTF-8 strings accurately', () => {
      render(<Base64Tool />);
      const input = screen.getByRole('textbox', { name: /base64 text input/i });
      const output = screen.getByRole('textbox', { name: /base64 text output/i });

      // Encode Unicode
      fireEvent.change(input, { target: { value: 'Hello 🚀 ToolBox' } });
      const encodeBtn = screen.getByRole('button', { name: /encode to base64/i });
      fireEvent.click(encodeBtn);

      expect(output.value).toBeTruthy();

      // Decode back
      fireEvent.change(input, { target: { value: output.value } });
      const decodeBtn = screen.getByRole('button', { name: /decode to text/i });
      fireEvent.click(decodeBtn);

      expect(output.value).toBe('Hello 🚀 ToolBox');
    });

    it('flags invalid Base64 input gracefully with error message', () => {
      render(<Base64Tool />);
      const input = screen.getByRole('textbox', { name: /base64 text input/i });
      fireEvent.change(input, { target: { value: '@@@NotValidBase64@@@' } });

      const decodeBtn = screen.getByRole('button', { name: /decode to text/i });
      fireEvent.click(decodeBtn);

      expect(screen.getByText(/invalid base64 string/i)).toBeInTheDocument();
    });
  });

  // 6. Text Diff Checker
  describe('Text Diff Checker', () => {
    it('calculates additions and deletions between two passages', () => {
      render(<TextDiffChecker />);
      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Line 1\nLine 2' } });
      fireEvent.change(inputs[1], { target: { value: 'Line 1\nLine Modified\nLine 3' } });

      expect(screen.getByText(/Additions/i)).toBeInTheDocument();
      expect(screen.getByText(/Deletions/i)).toBeInTheDocument();
    });

    it('handles identical inputs cleanly', () => {
      render(<TextDiffChecker />);
      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Identical' } });
      fireEvent.change(inputs[1], { target: { value: 'Identical' } });

      expect(screen.getByText('+0 Additions')).toBeInTheDocument();
      expect(screen.getByText('-0 Deletions')).toBeInTheDocument();
    });
  });

  // 7. Slug Generator
  describe('Slug Generator', () => {
    it('generates clean URL-safe slugs with accents normalized', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      fireEvent.change(input, { target: { value: 'Café & Résumé in Paris 2026!' } });

      // Should normalize accents e -> e and strip special chars
      expect(screen.getByText('cafe-resume-in-paris-2026')).toBeInTheDocument();
    });

    it('handles empty input gracefully', () => {
      render(<SlugGenerator />);
      const input = screen.getByRole('textbox', { name: /input text for slug generation/i });
      fireEvent.change(input, { target: { value: '' } });

      expect(screen.getByText(/slug preview will appear here/i)).toBeInTheDocument();
    });
  });

  // 8. UUID Generator
  describe('UUID Generator', () => {
    it('generates cryptographically valid v4 UUIDs', () => {
      render(<UuidGenerator />);
      // Should generate UUIDs matching v4 pattern
      const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
      const elements = screen.getAllByText(uuidRegex);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('supports formatting options: uppercase and removing hyphens', () => {
      render(<UuidGenerator />);
      const uppercaseCheckbox = screen.getByRole('checkbox', { name: /uppercase/i });
      fireEvent.click(uppercaseCheckbox);

      const noHyphensCheckbox = screen.getByRole('checkbox', { name: /remove hyphens/i });
      fireEvent.click(noHyphensCheckbox);

      const rawTextNodes = screen.getAllByText(/[0-9A-F]{32}/);
      expect(rawTextNodes.length).toBeGreaterThan(0);
    });
  });
});
