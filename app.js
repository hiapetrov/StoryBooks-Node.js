const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')
const {engine} = require('express-handlebars')
const MongoDBStore = require('connect-mongodb-session')(session)

//Load Config
dotenv.config({ path: './config/config.env'})

//passport
require('./config/passport')(passport);

//Save sessions
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions',
  });


connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebar helpers
const { formatDate, stripTags, truncate, editIcon, } = require('./helpers/hbs')

//Handlebars
app.engine('.hbs', engine({ 
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
  },
    defaultLayout: 'main', 
    extname: '.hbs'
  }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: store,
    
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global variable
app.use(function(req, res, next) {
  res.locals.user = req.user || null,
  next()
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes 
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000



app.listen(
    PORT, 
    console.log(`Server running on ${process.env.NODE_ENV} mode on ${PORT}`)
)