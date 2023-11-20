const User = require("../models/userModel");
const Story = require("../models/storyModel");

const bookmarkStory = async (req, res) => {
    try {
        let storyId = req.params.id;
        const { userId } = req.body;


        const user = await User.findById(userId);
        const story = await Story.findById(storyId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        if (user.bookmarks.includes(storyId)) {
            return res
                .status(400)
                .json({ message: "Story already bookmarked", bookmarked: true });
        }
        user.bookmarks.push(storyId);
        await user.save();
        story.bookmarks.push(userId);
        await story.save();

        res.status(200).json({
            message: "Story bookmarked successfully",
            bookmarks: user.bookmarks,
            bookmarked: true,
            story,
        });
    } catch (error) {

        res.status(500).json({ message: "Error bookmarking story", error: error.message });
    }
};


const getAllBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarks = await Story.find({ _id: { $in: user.bookmarks } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ bookmarks });

  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookmarks", error });
  }
};

const likeStory = async (req, res) => {
    const storyId = req.params.id;
    const userId = req.body.userId;
  
    try {
      const story = await Story.findById(storyId);
      const user = await User.findById(userId);
  
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.likes.includes(storyId)) {
        return res.status(400).json({
          message: "You have already liked this story",
          liked: true,
          story: story,
        });
      }
  
      story.likes.push(userId);
      await story.save();
  
      user.likes.push(storyId);
      await user.save();
  
      story.totalLikes = story.likes.length;
      res.json({
        message: "Story liked successfully",
        totalLikes: story.totalLikes,
        story: story,
        liked: true,
        likes: story.likes,
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
};
  

const removeBookmark = async (req, res) => {};

module.exports = {
    bookmarkStory,
    likeStory,
   getAllBookmarks
};