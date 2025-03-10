const express = require('express');
const jwt = require('jsonwebtoken');
const expressSession = require('express-session'); 
let books = require("./booksdb.js"); 
const regd_users = express.Router();

const JWT_SECRET = "244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273"; 

const isValid = (username) => {
  return true; 
};
const authenticatedUser = (username, password) => {
  return true; 
};

regd_users.use(expressSession({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  req.session.token = token; // Save token in session

  return res.status(200).json({ message: "Login successful!", token });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;  
  const token = req.session.token; 

  if (!token) {
    return res.status(403).json({ message: "User not logged in." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    const username = decoded.username; 
    const book = books[isbn]; 

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review not found." });
    }

    delete book.reviews[username];

    return res.status(200).json({
      message: `Review for book ${isbn} deleted successfully.`
    });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = []; 
