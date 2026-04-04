const express = require('express');
const { createStudent, getStudents, getStudent } = require('../controllers/student');
const router = express.Router();


router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);

module.exports = router;