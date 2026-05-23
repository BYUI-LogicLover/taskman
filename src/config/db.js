const mongoose = require('mongoose');

async function connectDB(uri, dbName) {
  if (!uri) {
    throw new Error('Missing MongoDB URI. Set MONGODB_URI in .env.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, dbName ? { dbName } : undefined);
  console.log(`mongo connected (db: ${mongoose.connection.name})`);
}

module.exports = { connectDB };
