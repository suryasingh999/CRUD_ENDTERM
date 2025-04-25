const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/booksDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));

const bookSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  publishedOn: Date,
  genre: String,
  rating: Number
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post('/books', async (req, res) => {
  const newBook = new Book({ ...req.body, id: uuidv4() });
  await newBook.save();
  res.json(newBook);
});

app.put('/books/:id', async (req, res) => {
  const updated = await Book.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(updated);
});

app.delete('/books/:id', async (req, res) => {
  await Book.findOneAndDelete({ id: req.params.id });
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
