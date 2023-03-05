// Import the required dependencies
const mongoose = require("mongoose");
const Thought = require("../models/thought");
const User = require("../models/user");

// Connect to your MongoDB database
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/ThoughtsUpDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

// Define the seed data
const thoughts = [
  { thoughtText: "Thought 1", username: "user1", reactions: [] },
  { thoughtText: "Thought 2", username: "user2", reactions: [] },
];

// Create a function to seed the data
const seedThoughts = async () => {
  try {
    // Remove any existing data
    await Thought.deleteMany({});
    await User.updateMany({}, { $set: { thoughts: [] } });

    // Create the new data
    const createdThoughts = await Thought.create(thoughts);

    // Associate the thoughts with the users
    for (const element of createdThoughts) {
      const thought = element;
      const user = await User.findOne({ username: thought.username });
      user.thoughts.push(thought._id);
      await user.save();
    }

    console.log("Data seeding successful!");
  } catch (error) {
    console.error("Error seeding data:", error.message);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};

// Call the function to seed the data
seedThoughts();

module.exports = seedThoughts;