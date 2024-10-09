require('dotenv').config();
import mongoose from 'mongoose';

let mongoUri;


if (process.env.NODE_ENV === 'test') {
    console.log("========== DB init - env - test  ===========")
    mongoUri = 'mongodb://strapi:strapi@localhost:3009/?authSource=admin'; // Test environment connection string
} else {
    console.log("========== DB init - env - not_test  ===========")
    mongoUri = 'mongodb://strapi:strapi@mongo:27017/?authSource=admin'; // Production/development environment connection string
}

//mongoose.connect('mongodb://strapi:strapi@mongo:27017/?authSource=admin', {
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 90000
}).then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
