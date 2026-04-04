exports.format = (id) => {
    const newId = parseInt(id) + 1; // convert id to number and increase by one

    return newId.toString().padStart(3, '0'); // return the formatted id returned to string and padded with 0
}