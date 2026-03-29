const express = require('express');
const { connectDB } = require('./config/database')
const app = express();
require('dotenv').config();

port = process.env.PORT || 5000;

app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        app.listen(() => {
            console.log(`Server running on port ${port}`)
        });
    }
    catch(err) {
        console.log('Failed to connect to the Database', err);
    }
}

startServer();