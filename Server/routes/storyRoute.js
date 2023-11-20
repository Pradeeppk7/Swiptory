const express = require("express");
const router = express.Router();
const { isAuth } = require("../middlewares/auth.js");
const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
} = require("../controllers/story.js");
const { likeStory } = require("../controllers/user.js");


// routes
router.post("/create", isAuth, createStory);
router.put("/update/:id", isAuth, updateStory);
router.put("/like/:id", isAuth, likeStory);
router.get("/getall", getStories);
router.get("/getbyId/:storyId", getStoryById);

module.exports = router;