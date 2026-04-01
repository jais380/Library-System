const mongoose = require('mongoose');


const attendantSchema = mongoose.Schema({
    name: {type: String, required: true},
    staffId: {type: String, unique: true}
}, {timestamps: true});

module.exports = mongoose.model('LibraryAttendant', attendantSchema);