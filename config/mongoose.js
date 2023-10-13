const mongoose= require('mongoose');

mongoose.connect('mongodb+srv://biswajitde487:biswajit123@cluster0.0cry1zn.mongodb.net/habit');

const db = mongoose.connection;

db.on('error',console.log.bind(console,"error connection to monogoDB "));

db.once('open',()=>{
    console.log("Succesfully Connecting to the mongoDB");
})
