# ToolBox — Security & Data Protection Architecture

Security and user privacy are central to ToolBox's system design. This document outlines the security controls, validation mechanisms, and client-side guarantees implemented across the codebase.

---

## 1. Zero-Retention / Local-First Privacy Guarantee

Unlike conventional online utilities, ToolBox operates on a **zero-retention policy**:

- **No Remote Processing**: All text manipulation, case conversion, diff checking, and UUID generation execute via client-side JavaScript.
- **In-Memory File Processing**: Images and PDF files uploaded by the user are read into memory via browser `FileReader` or `arrayBuffer()`. They are never transmitted over the network to any server.
- **Session Lifecycle**: As soon as a user navigates away or refreshes the page, memory buffers and temporary `blob:` URLs are automatically revoked and garbage collected.

---

## 2. Input Validation & Magic Byte Signature Verification

Attackers frequently disguise malicious executables or scripts by changing file extensions (e.g. renaming `malware.exe` to `image.png`). ToolBox validates raw binary magic bytes before passing data to canvas or decoders:

Located in `src/lib/security.ts`:

- **JPEG**: Asserts first 3 bytes are `FF D8 FF`.
- **PNG**: Asserts first 8 bytes match the PNG magic sequence `89 50 4E 47 0D 0A 1A 0A`.
- **PDF**: Asserts document begins with `%PDF-` (`25 50 44 46 2D`).
- **WebP**: Asserts header contains `RIFF` and bytes 8-11 are `WEBP`.
- **HEIC**: Asserts byte offset 4-7 contains the `ftyp` brand.

---

## 3. File Size Restrictions

To prevent browser memory exhaustion (OOM crashes) or Denial of Service on low-end mobile devices, upload components enforce strict client-side limits:

- **Images**: Max 25 MB (`MAX_FILE_SIZES.IMAGE`)
- **PDFs**: Max 50 MB (`MAX_FILE_SIZES.PDF`)
- **Text / Code**: Max 10 MB (`MAX_FILE_SIZES.TEXT`)

---

## 4. Cross-Site Scripting (XSS) Prevention

- **React Automatic Escaping**: User inputs in text areas and diff viewers are rendered using React JSX text nodes, which automatically escape HTML entities.
- **Sanitization Utility**: `sanitizeText()` explicitly escapes `<`, `>`, `&`, `"`, and `'` for any user-generated content displayed dynamically.
- **Safe URLs**: URL validation (`isValidUrl()`) explicitly forbids `javascript:`, `vbscript:`, or `data:text/html` schemes.

---

## 5. Memory Leak Prevention (Safe Object URL Registry)

Browsers do not automatically garbage collect `URL.createObjectURL()` references until the document is closed. To prevent memory leaks during heavy batch conversions:
- `SafeUrlRegistry` tracks created object URLs.
- Handlers explicitly revoke previous object URLs (`URL.revokeObjectURL(url)`) when inputs change or clear buttons are triggered.
