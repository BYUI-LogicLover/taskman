require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

connectDB(mongoUri, dbName)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
