const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        'mongodb+srv://hemanth:hello@cluster0.xmv0h.mongodb.net/devTinder'
    );
};

module.exports = connectDB;


