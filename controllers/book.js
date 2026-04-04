const bookModel = require('../models/book.model');
const authorModel = require('../models/author.model');
const studentModel = require('../models/student.model');
const attendantModel = require('../models/attendant.model');
const { generateIsbn } = require('../utils/isbnGen');


exports.createBook = async (req, res) => {
    try {
        const { title, authors } = req.body;

        // validates title availability
        if (!title || title.trim() === "" || !authors) {
            return res.status(400).json({error: "Title or Author of the book is missing"});
        }

        const generatedIsbn = generateIsbn(); // generates isbn for book

        // validates authors that exist
        const validAuthors = [];

        for(const a of authors) {
            const exists = await authorModel.exists({ _id: a });

            if (!exists) {
                return res.status(400).json({error: `Author with ID ${a} does not exist`});
            }

            validAuthors.push(a);
        }

        const newBook = await bookModel.create({
            title: title.trim(),
            isbn: generatedIsbn,
            authors: validAuthors
        });

        res.status(201).json({message: "Book Created Successfully", data: newBook});

    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.borrowBook = async (req, res) => {
    try {

        if (!req.body || !req.body.borrowedBy || !req.body.issuedBy || !req.body.returnDate) {
            return res.status(400).json({error: "Missing data fields"});
        }

        const { borrowedBy, issuedBy, returnDate } = req.body;
        const bookId = req.params.id;

        // check if Attendant and student exist
        const validAttendant = await attendantModel.exists({_id: issuedBy});

        if(!validAttendant) {
            return res.status(400).json({error: "Issuer is not a valid Library Attendant"});
        }

        const validStudent = await studentModel.exists({_id: borrowedBy});

        if(!validStudent) {
            return res.status(400).json({error: "Borrower is not a valid Student"});
        }

        // check if book is available
        const inStock = await bookModel.findById(bookId).select('status');

        if (inStock.status === 'OUT') {
            return res.status(400).json({error: "Book unavailable"});
        }

        // ensure return date is not later than current date
        const currentDate = new Date();
        const returnD = new Date(returnDate);

        if(isNaN(returnD.getDate())) {
            return res.status(400).json({error: "returnDate should be a valid Date"});
        }

        if(currentDate > returnD) {
            return res.status(400).json({error: "returnDate cannot be before the date of borrowing"});
        }

        const newEntry = await bookModel.findByIdAndUpdate(bookId, {
            status: 'OUT',
            borrowedBy: borrowedBy.trim(),
            issuedBy: issuedBy.trim(),
            returnDate: returnD
        }, {new: true}).populate('authors').populate('issuedBy').populate('borrowedBy');

        res.status(201).json({message: "Book Borrowed Successfully", data: newEntry});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.returnBook = async (req, res) => {
    try {
        if (!req.body || !req.body.borrowedBy || req.body.borrowedBy.trim() === "") {
            return res.status(400).json({error: "Missing data fields"});
        }

        const { borrowedBy } = req.body;
        const bookId = req.params.id;

        // validate student exists
        const validStudent = await studentModel.exists({_id: borrowedBy});

        if(!validStudent) {
            return res.status(400).json({error: "Student ID is not valid"});
        }

        // checks if book is available
        const book = await bookModel.findById(bookId)
            .select('status')
            .select('returnDate');

        console.log(book.borrowedBy)

        if(book.status === 'IN') {
            return res.status(400).json({error: "Book was not borrowed by this student"});
        }

        const newEntry = await bookModel.findByIdAndUpdate(bookId, {
            status: 'IN',
            borrowedBy: null,
            issuedBy: null,
            returnDate: null
        }, {new: true}).populate('authors').populate('issuedBy').populate('borrowedBy');

        // confirm if the student returnDate is overdue
        const currentDate = new Date();
        const returnD = book.returnDate;

        res.status(201).json({
            message: returnD < currentDate ? "Your book return was overdue. Charges will apply" : "Book Returned Successfully",
            data: newEntry
        });
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const books = await bookModel.find()
            .skip(skip)
            .limit(limit)
            .populate('authors');

        res.status(200).json({ data: books });
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await bookModel.findById(bookId).populate('authors');

        if(!book) {
            return res.status(404).json({message: "Book does not exist"});
        }

        res.status(200).json({ data: book });
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        if(!req.body || !req.body.title || !req.body.authors) {
            return res.status(400).json({error: "Title or Authors of Book is missing"});
        }

        const { title, authors } = req.body;

        const updatedBook = await bookModel.findByIdAndUpdate(bookId, { title, authors }, {new: true}).populate('authors');

        // validate updatedAuthor exists
        if (!updatedBook) {
            return res.status(404).json({error: "Book does not exist"});
        }

        res.status(200).json({data: updatedBook});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        await bookModel.findByIdAndDelete(bookId);

        res.status(204).json({message: "Book deleted successfully"});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}