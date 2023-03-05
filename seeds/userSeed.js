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
  }
);

// Define the seed data
const users = [
  { username: "user1", email: "user1@example.com", thoughts: [], friends: [] },
  { username: "user2", email: "user2@example.com", thoughts: [], friends: [] },
];

const thoughts = [
  { thoughtText: "Thought 1", username: "user1", reactions: [] },
  { thoughtText: "Thought 2", username: "user2", reactions: [] },
];

const reactions = [
  { reactionBody: "Reaction 1", username: "user1" },
  { reactionBody: "Reaction 2", username: "user2" },
  { reactionBody: "Reaction 3", username: "user1" },
];

// Create a function to seed the data
const seedData = async () => {
  try {
    // Remove any existing data
    await Thought.deleteMany({});
    await User.deleteMany({});

    // Create the new data
    const createdUsers = await User.create(users);
    const createdThoughts = await Thought.create(thoughts);

    // Associate the thoughts with the users
    for (let i = 0; i < createdThoughts.length; i++) {
      const thought = createdThoughts[i];
      const user = createdUsers.find(
        (user) => user.username === thought.username
      );
      user.thoughts.push(thought._id);

      // Associate reactions with the thoughts
      for (let j = 0; j < reactions.length; j++) {
        const reaction = reactions[j];
        if (reaction.username === user.username) {
          thought.reactions.push(reaction);
        }
      }

      await user.save();
      await thought.save();
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
seedData();
