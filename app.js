const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');


const app = express();

app.use(morgan('dev'));

app.set('view engine','ejs');
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//init session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,  //secure : true  /// production server
    }
}))

// initialize connect-flash 

app.use(connectFlash());
app.use((req,res, next)=>{
    res.locals.messages = req.flash();
    next();
})



app.use('/', require('./routes/index.route'))
app.use('/auth', require('./routes/auth.route'))
app.use('/user',require('./routes/user.route'))



app.use((req, res, next)=>{
    next(createHttpError.NotFound())
})


app.use((error, req, res, next)=>{
    error.status = error.status || 500;
    res.status(error.status);
    res.render('error_404',{error})
    
})


const PORT = process.env.PORT || 3006;

mongoose.connect(process.env.MONGO_URI,{
    dbName: process.env.DB_name,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("MongoDB connnected with server")
})
.catch((err)=>{
    console.log(err)
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))