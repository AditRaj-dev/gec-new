'use client'; // Error boundaries must be Client Components

// Renders only when the root layout itself throws. Per Next 16 docs
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md),
// global-error replaces the root layout entirely and must define its own <html>/<body> —
// it does not receive globals.css, so styling here is inlined and kept minimal.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F6F1E7',
          color: '#222222',
          fontFamily: 'Manrope, system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>This build hit a snag.</h1>
          <p style={{ margin: '0 0 20px', maxWidth: 420 }}>
            Something failed on our end, not yours. Try again — most of the time the second attempt just works.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: '#A3040F',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '10px 20px',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Try again →
          </button>
        </div>
      </body>
    </html>
  );
}
