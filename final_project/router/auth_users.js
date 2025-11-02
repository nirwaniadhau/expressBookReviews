const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username already exists
const isValid = (username) => {
  let usersWithSameName = users.filter((user) => user.username === username);
  return usersWithSameName.length > 0;
};

// Function to check if username and password match
const authenticatedUser = (username, password) => {
  let validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
