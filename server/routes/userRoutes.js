const { register, login, validateUser, setAvatar } = require('../controllers/usersController');


const router = require('express').Router();

router.post("/register", register);

router.post("/login", login)

router.post("/setAvatar/:id", setAvatar)

router.post("/validateUser", validateUser)

module.exports = router;