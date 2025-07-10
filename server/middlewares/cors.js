const cors = require('cors');

const allowedOrigins = [
  'https://cattle-bes.up.railway.app', // your deployed frontend
  'http://localhost:5173',             // local dev (Vite default)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

module.exports = cors(corsOptions);
