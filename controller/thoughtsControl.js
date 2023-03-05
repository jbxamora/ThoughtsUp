const { Thought, User } = require("../models");


const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => {
        // Send all thoughts as a response
        res.json(thoughts);
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Get one thought by its ID, create thought and associate it with a user
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        // Associate the newly created thought with a user
        return User.findOneAndUpdate(
          { _id: req.body.userID },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((userData) => {
        // Send the user data with the updated thoughts array as a response
        res.json(userData);
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Update thought by its ID
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((thought) => {
        if (!thought) {
          // Send 404 error response if no thought is found
          res.status(404).json({ message: "No thought found with that ID" });
        } else {
          // Send updated thought as a response
          res.json(thought);
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Get a thought by its ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          // Send 404 error response if no thought is found
          res.status(404).json({ message: "No thought found with that ID" });
          return;
        }
        // Send the thought as a response
        res.json(dbThoughtData);
      })
      .catch((err) => {
        // Send error response if there's an error
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Delete a thought by its ID
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) => {
        if (!thought) {
          // Send 404 error response if no thought is found
          res.status(404).json({ message: "No thought found with that ID" });
        } else {
          // Remove the thought from the user's thoughts array and send success message as a response
          return User.findOneAndUpdate(
            { _id: req.body.userID },
            { $pull: { thoughts: thought._id } },
            { new: true }
          ).then(() => {
            res.json({ message: "Thought and associated user deleted!" });
          });
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought by its ID
  addReaction(req, res) {
    console.log("You are adding a reaction");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Delete a reaction from a thought by its ID and reaction ID
  deleteReaction(req, res) {
    console.log(req.params);

    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;
