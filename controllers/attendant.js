const attendantModel = require('../models/attendant.model');
const { staffIdGen } = require('../services/staffIdService');


exports.createAttendant = async (req, res) => {
    try {
        const { name } = req.body; // Only accept name field

        // validates name is available
        if (!name || name.trim() === "") {
            return res.status(400).json({error: "Name of Library Attendant is required"});
        }

        const generatedStaffId = await staffIdGen(); // generate staffId

        const responseData = await attendantModel.create({
            name: name.trim(),
            staffId: generatedStaffId
        });

        res.status(201).json({message: "Library Attendant created successfully", data: responseData});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getAttendant = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // convert page to number
        const limit = parseInt(req.query.limit) || 10; // convert limit to number

        const skip = (page - 1) * limit; // skip logic

        const data = await attendantModel.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({data: data});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}