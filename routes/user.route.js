const express = require('express')
const Router = express.Router();
const {isAuthenticated} = require('../middlewares/auth.middleware')
const userController = require('../controller/user.controller')
const usercontroller = new userController();

Router.post('/signup', usercontroller.signup)
Router.post('/signin', usercontroller.signin)
Router.post('/changePassword', isAuthenticated, usercontroller.changepassword)
Router.post('/logout', isAuthenticated, usercontroller.logout)

module.exports = Router