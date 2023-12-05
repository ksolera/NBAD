//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const mainRoutes = require('./routes/mainRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();

//config app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://0.0.0.0:27017/sample';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect (url)
.then(()=>{
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
    });
})
.catch((err)=>{
    console.log(err.message);
})

//mount middleware
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


//create session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: new MongoStore({ mongoUrl: 'mongodb://0.0.0.0:27017/sample' })
}));

app.use(flash());
//create middleware
app.use((req, res, next) => {

    console.log(req.session,'checking session');
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})


app.use('/connections', connectionRoutes);
app.use('/', mainRoutes);
app.get('/', (req, res) => {
    res.render('index');
});
app.use('/users', userRoutes);

app.use((req, res, next) => {
    let err=new Error('the server cannot locate '+ req.url);
    err.status = 404;

    next(err);
    });

app.use((err, req, res, next) => {
    if(!err.status){
        console.log(err);
        err.status = 500;
        err.message = 'Something went wrong';
    }

    res.status(err.status);
    console.log(err);
    res.render('error', {error: err}); 
})
