const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios"); // <-- Added for async tasks

// ---------------------
// 1️⃣  Register User
// ---------------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});

// ---------------------
// 2️⃣  Get all books (Sync Version)
// ---------------------
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// ---------------------
// 🔹 Task 10: Get all books using Async/Await + Axios
// ---------------------
public_users.get('/async/books', async (req, res) => {
  try {
    // Simulate fetching from a local endpoint
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ---------------------
// 3️⃣  Get book by ISBN (Sync Version)
// ---------------------
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ---------------------
// 🔹 Task 11: Get book by ISBN using Async/Await + Axios
// ---------------------
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});

// ---------------------
// 4️⃣  Get book by Author (Sync Version)
// ---------------------
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filteredBooks.push(books[key]);
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// ---------------------
// 🔹 Task 12: Get book by Author using Async/Await + Axios
// ---------------------
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// ---------------------
// 5️⃣  Get book by Title (Sync Version)
// ---------------------
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      filteredBooks.push(books[key]);
    }
  }

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// ---------------------
// 🔹 Task 13: Get book by Title using Async/Await + Axios
// ---------------------
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// ---------------------
// 6️⃣  Get book reviews
// ---------------------
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
