exports.generateIsbn = () => {
    const timestamp = Date.now(); // gets current time

    return `ISBN-${timestamp}`;
}