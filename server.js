const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const routes = require('./routes/UserRoute');
const passport = require('passport');
const {PassportAuth} = require('./auth/UserAuth')
const cors = require('cors');
const UserModel = require('./models/UserModel');
const app = express();
const DB_URI= 'mongodb+srv://shivanshv701:xX6g5n4vX6MKjsQk@cluster0.wxz5nuz.mongodb.net/Authdb?retryWrites=true&w=majority';
// const DB_URI = 'mongodb://localhost:27017/AuthDB'
// const DB_URI = process.env.MONGODB_SERVER


app.use(cors());
const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'app_sessions'
})


mongoose.connect(DB_URI);
mongoose.connection.once('open', (err) => {
    if (!err) {
        console.log(typeof(DB_URI));
        console.log('Connected to MongoDB');
    }
});


app.use(bodyParser.json());
app.use(session({
    secret: 'This is my secret sessions and cookies',
    saveUninitialized: false,
    resave: false,
    store: store,
    cookie: {
        
        maxAge: 600000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(PassportAuth());

app.use('/api', routes);


let port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server is running on port 8000');
});

module.exports = app
