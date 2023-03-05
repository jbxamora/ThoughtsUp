const express = require('express');
const db = require('./config/connect');
const seedUsers = require('./seeds/userSeed');
const seedThoughts = require('./seeds/thoughtSeed');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Connect to the MongoDB database
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Successfully connected to MongoDB database');

    try {
        // Call your seed functions here
        await seedUsers();
        await seedThoughts();
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding the database:', error.message);
    }

    // Start the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
