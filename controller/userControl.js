const req = require("express/lib/request");
const { Thought, User } = require("../models");

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find()
      .then((users) => {
        // Send all users as a response
        res.json(users);
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => {
        // Send the newly created user data as a response
        res.json(dbUserData);
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Update a user by its ID
  updateUser(req, res) {
    User.findOneAndUpdate(
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
      .then((user) => {
        if (!user) {
          // Send 404 error response if no user is found
          res.status(404).json({ message: "No user found with that ID" });
        } else {
          // Send updated user data as a response
          res.json(user);
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Delete a user and their associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          // Send 404 error response if no user is found
          res.status(404).json({ message: "No user found with that ID" });
        } else {
          // Delete all thoughts associated with the user and send success message as a response
          Thought.deleteMany({
            _id: {
              $in: user.thoughts,
            },
          }).then(() => {
            res.json({ message: "User and associated thoughts deleted!" });
          });
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Get a user by its ID
  getUserById(req, res) {
    User.findOne({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          // Send 404 error response if no user is found
          res.status(404).json({ message: "No user found with that ID" });
        } else {
          // Send the user data as a response
          res.json(user);
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.body);
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $addToSet: {
          friends: req.params.friendsId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((user) => {
        if (!user) {
          // Send 404 error response if no user is found
          res.status(404).json({
            message: "No user found with that ID",
          });
        } else {
          // Send the updated user data as a response
          res.json(user);
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $pull: {
          friends: req.params.friendsId,
        },
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((user) => {
        if (!user) {
          // Send 404 error response if no user is found
          res.status(404).json({ message: "No user found with that ID" });
        } else {
          // Send the updated user data as a response
          res.json(user);
        }
      })
      .catch((err) => {
        // Send error response if there's an error
        res.status(500).json(err);
      });
  },
};

module.exports = userController;
