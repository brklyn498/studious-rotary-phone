## 2024-05-23 - [HIGH] Fix Stored XSS in Product Description
**Vulnerability:** Product descriptions were rendered using `dangerouslySetInnerHTML` directly from the API response without sanitization. This allows stored XSS if the API returns malicious script tags.
**Learning:** Next.js `dangerouslySetInnerHTML` is a sink for XSS. When rendering HTML from an external source (even a trusted API), it must be sanitized.
**Prevention:** Always use `DOMPurify.sanitize()` (via `isomorphic-dompurify` for SSR) before passing strings to `dangerouslySetInnerHTML`.
