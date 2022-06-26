const { addMessage, getAllMessages } = require('../controllers/messageController');


const router = require('express').Router();

router.post("/addMessage", addMessage);
router.post("/getMessage", getAllMessages);

module.exports = router;