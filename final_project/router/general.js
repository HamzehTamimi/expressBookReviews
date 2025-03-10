const express = require('express');
let books = require("./booksdb.js"); 
const public_users = express.Router();


const getBooks = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);  
    } else {
      reject("Books not found");  
    }
  });
};

public_users.get('/', function (req, res) {
  getBooks()
    .then((booksList) => {
      res.status(200).json(booksList); 
    })
    .catch((error) => {
      res.status(500).json({ message: error });  
    });
});

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully!" });
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
      reject("Book not found.");
    }
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = [];

  new Promise((resolve, reject) => {
    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author) {
        booksByAuthor.push(books[isbn]);
      }
    }
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found by this author.");
    }
  })
    .then((booksByAuthor) => {
      res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = [];

  new Promise((resolve, reject) => {
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title)) {
        booksByTitle.push(books[isbn]);
      }
    }
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with this title.");
    }
  })
    .then((booksByTitle) => {
      res.status(200).json(booksByTitle);  
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    if (books[isbn] && books[isbn].reviews) {
      const reviews = books[isbn].reviews;
      if (Object.keys(reviews).length > 0) {
        resolve(reviews);  
      } else {
        reject("No reviews available for this book.");
      }
    } else {
      reject("Book not found.");
    }
  })
    .then((reviews) => {
      res.status(200).json(reviews);  
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

module.exports.general = public_users;
