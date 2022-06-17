const { register, login, validateUser } = require('../controllers/usersController');


const router = require('express').Router();

router.post("/register", register);

router.post("/login", login)

router.post("/validateUser", validateUser)

module.exports = router;