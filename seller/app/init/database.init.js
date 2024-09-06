import mongoose from 'mongoose';

mongoose.connect('mongodb://strapi:strapi@mongo:27017/?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 90000
}).then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
