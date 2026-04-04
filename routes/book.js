const express = require('express');
const router = express.Router();
const { createBook, borrowBook, returnBook, getBooks, getBook, updateBook, deleteBook } = require('../controllers/book');


router.post('/', createBook);
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.get('/', getBooks);
router.get('/:id', getBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;