/**
 * Proxies only /api to the backend (localhost:5000).
 * Other requests (static files, HMR, images) are not proxied.
 * Ensure the backend is running: cd backend && npm run dev (or node server.js).
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      timeout: 60000,
      onError: (err, req, res) => {
        console.error('[proxy] Backend error:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Backend unreachable. Is the server running on port 5000?',
        }));
      },
    })
  );
};
