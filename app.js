// index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar ao MongoDB Atlas
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas:', err));

// Definir o esquema e o modelo
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Item = mongoose.model('Item', ItemSchema);

// Rota para criar (inserir) um novo item
app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Rota para buscar todos os itens

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
