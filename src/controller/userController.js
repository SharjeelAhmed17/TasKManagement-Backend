const { User, Task} = require('../model/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { error } = require('console');


function userRegistration(req){
    const user = new User({
        fullName : req.body.fullName,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,8)
    })
    return user
}

function taskAddition(req){
    const task = new Task({
      task : req.body.task,
        user : req.body.userId,
        status : req.body.status
    })
    return task
}

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password)
}

function checkErr500 (err, res){
    if (err) {
        res.status(500).json({message : 'Server Error'})
        return true
    }
    return false
}

exports.signUp = async (req, res) => {
    try {
      const user = userRegistration(req);
      await user.save();
      res.status(200).json({ message: "User added" });
    } catch (err) {
      console.log(err)
      if (checkErr500(err, res)) {
        return;
      }
    }
  }

  exports.signin = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      if (!isValidPassword(user, req.body.password)) {
        return res.status(401).json({ accessToken: null, message: 'Invalid password' });
      }
  
      const token = jwt.sign({ email: user.email, id: user.id }, process.env.API_SECRET, { expiresIn: 9999 });
  
      res.status(200).json({
        user: {
          id: user.id,
          fullName: user.fullName
        },
        message: 'Successful Signin',
        token: token
      });
    } catch (err) {
      if (checkErr500(err, res)) {
        return;
      }
    }
  }

  exports.addTask = async (req, res) => {
    try {
      const task = taskAddition(req)
      await task.save()
  
      const { userId } = req.body
  
      const user = await User.findById(userId)

      if (!user) {
        return res.status(400).json({ message : "User not found"})
    }

    user.tasks.push(task.id)
    await user.save()

      res.status(200).json({
        message: 'Task added' 
      });
    } catch (err) {
      console.log(err)
      if (checkErr500(err, res)) {
        return;
      }
    }
  };

  exports.taskMap = async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId);
      const tasks = user.tasks;
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      const todoTasks = [];
      const inProgressTasks = [];
      const completedTasks = [];
  
      for (const id of tasks) {
        const task = await Task.findById(id)
  
        if (task.status === 'To-do') {
          todoTasks.push(task);
        }
        if (task.status === 'In-progress') {
          inProgressTasks.push(task);
        }
        if (task.status === 'Completed') {
          completedTasks.push(task);
        }
      }
  
      res.status(200).json({
        todo: todoTasks.map((task) => ({
          id: task.id,
          status: task.status,
          task : task.task
        })),
        inProgress: inProgressTasks.map((task) => ({
            id: task.id,
            status: task.status,
            task : task.task
        })),
        completed: completedTasks.map((task) => ({
            id: task.id,
            status: task.status,
            task : task.task
        }))
      });
    } catch (err) {
      console.log(err)
      if (checkErr500(err, res)) {
        return;
      }
    }
  };

  exports.statusTask = async (req, res) => {
    try{
      const { taskId, taskStatus} = req.body;
      // console.log(taskId)
      // console.log(taskStatus)
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(400).json({ message : 'Task not found'});
      }
      task.status = taskStatus;
      task.save();

      res.status(200).json({ message : `Task is added to ${taskStatus} queue `});

    }catch(err){
      if(checkErr500(err, res)){
        return;
      }
    }
  };

  exports.deleteTask = async (req, res) => {
    try {
      const { taskId, userId } = req.body
      const task = await Task.findById(taskId)
      // console.log(task)
  
      if (!task) {
        return res.status(400).json({ message: 'Task not found' });
      }
  
    //   await  User.findByIdAndUpdate(task.user,{$pull:{tasks: taskId}});
      await  User.findByIdAndUpdate(userId,{$pull:{tasks: taskId}});
  
      await Task.deleteOne({ _id: taskId });
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.log(err)
      if (checkErr500(err, res)) {
        return;
      }
    }
  };
  
  


