require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const passport = require('passport');
const cookieSession = require('cookie-session');
const passportSetup = require('./config/passportSetup');

const app = express();
const PORT = process.env.PORT;
connectDB();

app.use(logger) ;//log requests to console and logfile

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
  );
app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// app.use(verifyJWT);
// app.use('/following', require('./routes/following'));
// app.use('/followers', require('./routes/followers'));
// app.use('/userList', require('./routes/list'));

app.use(errorHandler); //log errors to errorLog file

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT,()=>{ console.log(`Express server listening on port ${PORT}`) });
})