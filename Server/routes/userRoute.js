const express = require('express');
const router = express.Router();
const { bookmarkStory, getAllBookmarks } = require('../controllers/user.js');
const {isAuth} = require('../middlewares/auth.js');

// bookmark routes
router.post('/bookmark/:id', isAuth , bookmarkStory);
router.get('/bookmarks/:userId', isAuth , getAllBookmarks);

module.exports = router;