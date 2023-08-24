const routes = require('express').Router();
const userController = require('../controller/userController');
const {authenticate} = require('../controller/jwtController');



routes.post('/sign_up', userController.signUp)
routes.post('/sign_in', userController.signin)

routes.use('/task_map', authenticate)
routes.post('/task_map', userController.taskMap)
routes.post('/add_task', userController.addTask)
routes.post('/delete_task', userController.deleteTask)
routes.post('/task_status', userController.statusTask)


module.exports = routes;