const authorModel = require('../models/author.model');

exports.createAuthor = async (req, res) => {
    try {
        // validates name is available
        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({error: "Name of Author is required"});
        }

        // validates bio is not blank if provided
        if (req.body.bio.trim() === "") {
            return res.status(400).json({error: "Bio cannot be left blank"});
        }

        const responseData = await authorModel.create({
            name: req.body.name.trim(),
            ...req.body
        }); // create author

        res.status(201).json({message: "Author Created Successfully", data: responseData});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getAuthors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // convert page to number
        const limit = parseInt(req.query.limit) || 10; // convert limit to number

        const skip = (page - 1) * limit; // skip logic

        const data = await authorModel.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({data: data});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        const author = await authorModel.findById(authorId);

        // validate author exists
        if (!author) {
            return res.status(404).json({error: "Author does not exist"})
        }

        res.status(200).json({data: author});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        if(!req.body || !req.body.name || !req.body.bio) {
            return res.status(400).json({error: "Name or Bio of Author is missing"});
        }

        const { name, bio } = req.body;

        const updatedAuthor = await authorModel.findByIdAndUpdate(authorId, { name, bio }, {new: true});

        // validate updatedAuthor exists
        if (!updatedAuthor) {
           return res.status(404).json({error: "Author does not exist"});
        }

        res.status(200).json({data: updatedAuthor});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;
        await authorModel.findByIdAndDelete(authorId);

        res.status(204).json({message: "Author deleted successfully"});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}