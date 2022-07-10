const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

//create a new user
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password needs to be at least 3 characters long",
    });
  }

  if (!password) {
    return response.status(400).json({
      error: "you need a password",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

//get all users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("weights");

  response.json(users);
});

module.exports = usersRouter;
