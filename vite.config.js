// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Include 404.html in the build output
      input: {
        main: resolve(__dirname, 'index.html'),
        'competition-details': resolve(__dirname, 'competition-details.html'),
        'admin': resolve(__dirname, 'admin.html'),
        'not-found': resolve(__dirname, '404.html'),
        'whatsapp': resolve(__dirname, 'whatsapp.html'),
      }
    }
  },
  server: {
    port: 3000,
  },
  // Rewrites for clean URLs
  appType: 'spa',
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  // Handle route rewrites for clean URLs
  plugins: [
    {
      name: 'rewrite-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle WhatsApp redirect routes
          if (req.url.startsWith('/whatsapp') && !req.url.includes('.')) {
            req.url = '/whatsapp.html';
            return next();
          }
          
          // Handle /competitions/:id routes
          if (req.url.startsWith('/competitions/') && !req.url.includes('.')) {
            req.url = '/competition-details.html';
            return next();
          }
          
          // Handle /admin/dashboard and other admin routes
          if ((req.url.startsWith('/admin/dashboard') || 
               req.url.startsWith('/admin/registration/')) && 
              !req.url.includes('.')) {
            req.url = '/admin.html';
            return next();
          }
          
          // Check if the requested file exists
          next();
        });
      },
    },
    {
      name: 'handle-404',
      configureServer(server) {
        // This needs to be the last middleware to catch all 404s
        server.middlewares.use((req, res, next) => {
          res.statusCode = 404;
          
          // Skip API requests and static assets
          if (req.url.includes('.') && 
              !req.url.endsWith('.html') && 
              !req.url.endsWith('/')) {
            return next();
          }
          
          // For the case when the request has already been handled
          const _end = res.end;
          res.end = function(chunk, ...args) {
            if (res.statusCode === 404) {
              // Serve the 404 page instead
              res.setHeader('Content-Type', 'text/html');
              fs.readFile(path.join(process.cwd(), '404.html'), (err, data) => {
                if (err) return _end.call(this, chunk, ...args);
                _end.call(this, data);
              });
            } else {
              _end.call(this, chunk, ...args);
            }
          };
          
          next();
        });
      },
      configurePreviewServer(server) {
        // Apply the same middleware to the preview server
        server.middlewares.use((req, res, next) => {
          res.statusCode = 404;
          
          if (req.url.includes('.') && 
              !req.url.endsWith('.html') && 
              !req.url.endsWith('/')) {
            return next();
          }
          
          const _end = res.end;
          res.end = function(chunk, ...args) {
            if (res.statusCode === 404) {
              res.setHeader('Content-Type', 'text/html');
              fs.readFile(path.join(process.cwd(), '404.html'), (err, data) => {
                if (err) return _end.call(this, chunk, ...args);
                _end.call(this, data);
              });
            } else {
              _end.call(this, chunk, ...args);
            }
          };
          
          next();
        });
      },
    },
  ],
});