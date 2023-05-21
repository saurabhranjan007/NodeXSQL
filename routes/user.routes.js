const express = require('express');
const router = express.Router()

const userLoginController = require('../controllers/user.controllers')

router.post("/login", userLoginController.loginController)
router.post('/reset', userLoginController.resetController)
router.get('/all', userLoginController.testUserController)


module.exports = router;