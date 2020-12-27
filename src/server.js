import express from 'express';
import cors from 'cors'; 
import mongoose from 'mongoose';

import 'babel-polyfill';
import dotenv from 'dotenv';

dotenv.config();

//Routes
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import articlesRouter from './routes/articles';
import categoryRouter from './routes/category';
import authRouter from './routes/auth';

const app = express();
app.use(express.json()); 

app.use(cors()); //Enable All CORS Requests
app.use('/uploads',express.static('uploads'))

//conexion con mongodb
var mongoDB = process.env.DB_HOST;
mongoose.connect(mongoDB, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3010, () => { console.log('Escuchando el puerto 3010') });


app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/articles', articlesRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;