const express = require('express');
const bodyParser = require('body-parser');
const { connect, getDB } = require('./configs/db.js');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

let collection; // MongoDB collection object



// Initialize the collection
(async () => {
  // Connect to MongoDB
  await connect()
  const db = getDB();
  collection = db.collection('items');
  console.log('MongoDB collection initialized');
})();

// Create a new item
app.post('/items', async (req, res) => {
  const newItem = {
    id: generateId(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  try {
    const result = await collection.insertOne(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read all items
app.get('/items', async (req, res) => {
  try {
    const items = await collection.find().toArray();
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read a specific item by ID
app.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await collection.findOne({ id: itemId });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(item);
    }
  } catch (error) {
    console.error('Error retrieving item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing item
app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  try {
    const result = await collection.updateOne({ id: itemId }, { $set: updatedItem });
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await collection.deleteOne({ id: itemId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
