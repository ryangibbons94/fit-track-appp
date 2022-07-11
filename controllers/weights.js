const weightRouter = require("express").Router();
const Weight = require("../models/weight");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//get all weight logs
weightRouter.get("/", async (request, response) => {
  const weight = await Weight.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(weight);
});

//get a single weight log from the id
weightRouter.get("/:id", async (request, response) => {
  const weightLog = await Weight.findById(request.params.id);

  if (weightLog) {
    response.json(weightLog);
  } else {
    response.status(404).end();
  }
});

//add a new weight log
weightRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = request.token;
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "token is missing or invalid" });
  }

  let date = new Date();
  date = date.toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const weight = new Weight({
    weight: body.weight,
    date: date,
    notes: body.notes,
    user: user._id,
  });
  const savedWeightLog = await weight.save();
  user.weights = user.weights.concat(savedWeightLog._id);
  await user.save();
  response.status(201).json(savedWeightLog);
});

//delete a single weight log
weightRouter.delete("/:id", async (request, response, next) => {
  const token = request.token;

  const user = request.user;

  const weightLogToDelete = await Weight.findById(request.params.id);

  if (weightLogToDelete.user._id.toString() === user._id.toString()) {
    try {
      await Weight.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } catch (exception) {
      next(exception);
    }
  } else {
    return response.status(401).json({ error: `Unauthorized` });
  }
});

//update a weight log
weightRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const weight = {
    weight: body.weight,
    date: body.date,
    notes: body.notes,
    user: request.user._id,
  };

  Weight.findByIdAndUpdate(request.params.id, weight, { new: true })
    .then((updatedWeightLog) => {
      response.json(updatedWeightLog);
    })
    .catch((error) => next(error));
});

module.exports = weightRouter;
