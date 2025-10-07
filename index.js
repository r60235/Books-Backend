const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db/connection.db');
const Book = require('./models/book.models');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Connect to the database
connectDB();

// 1. Create a new book
app.post('/books', async (req, res) => {
  const { title, author, publishedYear, genre, language, country, rating, summary, coverImageUrl } = req.body;

  try {
    const newBook = new Book({ title, author, publishedYear, genre, language, country, rating, summary, coverImageUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: 'Error creating book', details: err });
  }
});



// 3. Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books', details: err.message })  }
});

// 4. Get book by title
app.get('/books/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const book = await Book.findOne({ title });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching book', details: err });
  }
});

// 5. Get books by author
app.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const books = await Book.find({ author });
    if (books.length === 0) {
      return res.status(404).json(books);
    }
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books by author', details: err });
  }
});

// 6. Get books by genre
app.get('/books/genre/:genre', async (req, res) => {
  const { genre } = req.params;

  try {
    const books = await Book.find({ genre: { $in: [genre] } });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books by genre', details: err });
  }
});

// 7. Get books by published year
app.get('/books/year/:year', async (req, res) => {
  const { year } = req.params;

  try {
    const books = await Book.find({ publishedYear: year });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching books by year', details: err });
  }
});

// 8. Update book rating by ID
app.post('/books/rating/:id', async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, { rating }, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book does not exist' });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Error updating book rating', details: err });
  }
});

// 9. Update book rating and details by title
app.post('/books/update/:title', async (req, res) => {
  const { title } = req.params;
  const { publishedYear, rating } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate({ title }, { publishedYear, rating }, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ error: 'Book does not exist' });
    }
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: 'Error updating book details', details: err });
  }
});

// 10. Delete book by ID
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting book', details: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
