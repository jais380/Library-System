require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database')
const app = express();

const port = process.env.PORT || 5000;

// Routes
const attendantRoutes = require('./routes/attendant');
const authorRoutes = require('./routes/author');
const bookRoutes = require('./routes/book');
const studentRoutes = require('./routes/student');

app.use(express.json());
app.use('/attendants', attendantRoutes);
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
app.use('/students', studentRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`)
        });
    }
    catch(err) {
        console.log('Failed to connect to the Database', err);
    }
}

startServer();