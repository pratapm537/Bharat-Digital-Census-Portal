import app from './app.js';
import { initDb } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Initialize Database then start the API Server
const startServer = async () => {
  try {
    await initDb();
    
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`  Bharat Census API Server running      `);
      console.log(`  Port: http://localhost:${PORT}        `);
      console.log(`  Environment: ${process.env.NODE_ENV} `);
      console.log(`========================================`);
    });
  } catch (error) {
    console.error('Fatal error during database or server startup:', error);
    process.exit(1);
  }
};

startServer();
