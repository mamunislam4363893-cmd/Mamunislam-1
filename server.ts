import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Import bot and its server logic
// Requiring bot.js starts the bot logic
const botInstance = require('./bot.js'); 
const { app } = require('./database/server.js');
const db = require('./db.js');

const PORT = 3000;

async function startServer() {
  // Wait for database to be ready
  console.log('⏳ Waiting for database readiness...');
  try {
    await db.dbReady;
    console.log('✅ Database is ready.');
  } catch (e) {
    console.error('⚠️ Database failed to initialize properly:', e);
  }

  // The 'app' from database/server.js already has API routes defined.
  
  // Vite middleware setup for React frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: {
          usePolling: true,
          interval: 1000
        }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Unified Bot & Web Server running on http://localhost:${PORT}`);
    console.log(`📍 User Panel: http://localhost:${PORT}/`);
    console.log(`📍 Admin Panel: http://localhost:${PORT}/admin`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Full-stack proxy might be sticking.`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
