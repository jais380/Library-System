const studentModel = require('../models/student.model');
const { studentIdGen } = require('../services/studentIdService');


exports.createStudent = async (req, res) => {
    try {
        const { name, email } = req.body;

        // validates either name or email is available
        if (!name || !email || name.trim() === "" || email.trim() === "") {
            return res.status(400).json({error: "Name or Email is missing"});
        }

        // checks if email exists
        const existingEmail = await studentModel.exists({ email: email });
        if (existingEmail) {
            return res.status(400).json({error: "User with Email already exists"});
        }

        const generatedStudentId = await studentIdGen(); // generate studentId

        const responseData = await studentModel.create({
            name: name.trim(),
            email: email.trim(),
            studentId: generatedStudentId
        });

        res.status(201).json({message: "Student Created Successfully", data: responseData});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // convert page to number
        const limit = parseInt(req.query.limit) || 10; // convert limit to number

        const skip = (page - 1) * limit; // skip logic

        const data = await studentModel.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({data: data});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}

exports.getStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        const student = await studentModel.findById(studentId);

        // verifies student with the provided id exists
        if(!student) {
            return res.status(404).json({error: "Student does not exist"});
        }

        res.status(200).json({data: student});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
}