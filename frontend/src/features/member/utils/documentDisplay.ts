export function detectDocumentMime(base64: string): string {
  const trimmed = base64.trim()
  if (trimmed.startsWith('JVBERi')) return 'application/pdf'
  if (trimmed.startsWith('/9j/')) return 'image/jpeg'
  if (trimmed.startsWith('iVBORw')) return 'image/png'
  if (trimmed.startsWith('R0lGOD')) return 'image/gif'
  return 'image/jpeg'
}

export function toDocumentDataUrl(base64?: string | null): string | null {
  if (!base64?.trim()) return null
  if (base64.startsWith('data:')) return base64
  const mime = detectDocumentMime(base64)
  return `data:${mime};base64,${base64}`
}

export function openDocumentInNewWindow(
  base64?: string | null,
  title = 'Document',
): void {
  const dataUrl = toDocumentDataUrl(base64)
  if (!dataUrl) return

  const mime = detectDocumentMime(base64 ?? '')
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=960,height=720')
  if (!popup) return

  if (mime === 'application/pdf') {
    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            html, body { margin: 0; height: 100%; background: #fafaf9; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="${dataUrl}" title="${title}"></iframe>
        </body>
      </html>
    `)
  } else {
    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fafaf9;
              padding: 1rem;
              box-sizing: border-box;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
              border-radius: 8px;
              box-shadow: 0 4px 24px rgba(28, 25, 23, 0.12);
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="${title}" />
        </body>
      </html>
    `)
  }

  popup.document.close()
}
