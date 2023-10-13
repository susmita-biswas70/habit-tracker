const express= require('express');
const db=require('./config/mongoose')
const path = require('path');
const bodyParser = require('body-parser')
const router =require('./routes/mainroutes')



const app= express();
const port = 5000;


// *******************    Set Template Engine  ***********************************//

app.set('view engine','ejs')

app.set('views', path.join(__dirname, 'views'))
// console.log(app.get("view engine"))

// *************************    Assets    ****************************************//

app.use("/assets", express.static('./assets'));
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// ***************************  Routes  *************************************//
app.use(router);



app.listen(port,(err)=>{
    if(err){
        console.log("Server is getting some error");
    }else{
        console.log("Server is running successfully on port",port);
    }
})