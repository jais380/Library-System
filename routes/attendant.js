const express = require('express');
const { createAttendant, getAttendant } = require('../controllers/attendant')
const router = express.Router();


router.post('/', createAttendant);
router.get('/', getAttendant);

module.exports = router;