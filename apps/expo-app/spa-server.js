import http from "http"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const PORT = 8081

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directory to serve
const publicDir = path.join(__dirname, "public")

// Helper: determine MIME type
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".ts.map": "application/json",
}

const server = http.createServer((req, res) => {
  let filePath = path.join(publicDir, req.url === "/" ? "/index.html" : req.url)

  // Prevent directory traversal attacks
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403)
    res.end("Forbidden")
    return
  }

  // Try to serve file
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback: return index.html for SPA routes
      const indexPath = path.join(publicDir, "index.html")
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(500)
          res.end("Internal Server Error")
        } else {
          res.writeHead(200, {
            "Content-Type": "text/html",
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "Surrogate-Control": "no-store",
          })
          res.end(data)
        }
      })
      return
    }

    // Serve static file
    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || "application/octet-stream"

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500)
        res.end("Internal Server Error")
      } else {
        res.writeHead(200, {
          "Content-Type": contentType,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store",
        })
        res.end(data)
      }
    })
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
