// Import the required dependencies
const mongoose = require('mongoose');
const User = require('../models/user');
const Thought = require('../models/thought');

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ThoughtsUpDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// Define the seed data
const users = [
    { username: 'user1', email: 'user1@example.com', thoughts: [], friends: [] },
    { username: 'user2', email: 'user2@example.com', thoughts: [], friends: [] }
];

// Create a function to seed the data
const seedUsers = async () => {
    try {
        // Remove any existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Create the new data
        const createdUsers = await User.create(users);

        console.log('Data seeding successful!');
    } catch (error) {
        console.error('Error seeding data:', error.message);
    } finally {
        // Disconnect from the database
        mongoose.disconnect();
    }
};

// Call the function to seed the data
seedUsers();


module.exports = seedUsers;