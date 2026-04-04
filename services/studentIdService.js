const studentModel = require('../models/student.model');
const { format } = require('../utils/idFormatter');

exports.studentIdGen = async () => {
    try {
        const lastStudent = await studentModel.findOne()
            .sort({ _id: -1 })
            .select('studentId');

        // validate lastStudent exists or its studentId exists
        if (!lastStudent || !lastStudent.studentId) {
            return "STU-001";
        }

        const strId = lastStudent.studentId.slice(-3);

        const formatted = format(strId);

        return `STU-${formatted}`;
    } catch(err) {
        throw new Error(`ID Generation Failed: ${err.message}`);
    }
}