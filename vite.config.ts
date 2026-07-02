import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const snapshotsDir = path.resolve(__dirname, 'snapshots')

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

// Serve frozen iteration snapshots (snapshots/iteration-N/) under /iteration-N/
// during `vite dev`, mirroring what server.js does in production. Without this,
// dev requests for /iteration-N/... fall through to the live app and render blank.
function serveSnapshots() {
  return {
    name: 'serve-snapshots',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        const m = url.match(/^\/(iteration-\d+)(\/.*)?$/)
        if (!m) return next()

        const snapDir = path.join(snapshotsDir, m[1])
        if (!fs.existsSync(snapDir)) return next()

        const rel = m[2] && m[2] !== '/' ? m[2] : '/index.html'
        let filePath = path.normalize(path.join(snapDir, rel))
        // Stay inside the snapshot folder; fall back to its index.html for
        // client-side (SPA) deep links that don't map to a real file.
        if (!filePath.startsWith(snapDir)) return next()
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          filePath = path.join(snapDir, 'index.html')
        }
        if (!fs.existsSync(filePath)) return next()

        res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream')
        fs.createReadStream(filePath).pipe(res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serveSnapshots()],
})
