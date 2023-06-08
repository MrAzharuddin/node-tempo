const { MongoClient } = require('mongodb');

const url = "mongodb+srv://yoyote6509:9H6ZfLoV4UAgX8Ub@cluster0.j8lvagu.mongodb.net/?retryWrites=true&w=majority"; // Update with your MongoDB connection string
const dbName = 'test'; // Update with your database name

const client = new MongoClient(url, { useUnifiedTopology: true });

let db;

async function connect() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

module.exports = { connect, getDB };
