const attendantModel = require('../models/attendant.model');
const { format } = require('../utils/idFormatter');

exports.staffIdGen = async () => {
    try {
        const lastStaff = await attendantModel.findOne()
            .sort({ _id : -1 })
            .select('staffId');

        // validate lastStaff exists or its staffId exists
        if (!lastStaff || !lastStaff.staffId) {
            return "LIB-001";
        }

        const strId = lastStaff.staffId.slice(-3); // get the last 3 digits

        const formatted = format(strId); // format the string id

        return `LIB-${formatted}`;
    } catch(err) {
        throw new Error(`ID Generation Failed: ${err.message}`);
    }
}