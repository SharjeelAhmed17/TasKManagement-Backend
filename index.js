const express = require('express');
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3002
const routes = require('./src/routes/Routes');
const mongoose = require('mongoose')


require('dotenv').config()

try{
  mongoose.connect('mongodb+srv://mongotuts:lraRjHjtSPG1gbYc@cluster0.6yopsjn.mongodb.net/TaskManagement_DB?retryWrites=true&w=majority',{
      useUnifiedTopology : true,
      useNewUrlParser : true,
  })
  console.log('connected to DB')
}
catch(error){
  console.log('DB error', error)
}

process.on('unhandledRejection', error => {
  console.log('DB error', error);
});

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

  app.listen(PORT,()=>{
    console.log(`Server is live at ${PORT}`)
})
