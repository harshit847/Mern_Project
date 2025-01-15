const mongoose = require('mongoose');

let isConnected = false; 

async function connectDB() {
    try {
        if (!isConnected) {
            await mongoose.connect(process.env.MONGODB_URI);

            const connection = mongoose.connection;

            connection.on('connected', () => {
                console.log("Connect to DB");
                isConnected = true; 
            });

            connection.on('error', (error) => {
                console.log("Something is wrong in MongoDB", error);
            });
        }
    } catch (error) {
        console.log("Something is wrong", error);
    }
}

module.exports = connectDB;
