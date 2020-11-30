const http=require('http');
const path=require('path');

const bodyParser=require('body-parser');
const express=require('express');

const adminRoute=require('./routes/admin');
const shopRoute=require('./routes/shop');
const errorHandler=require('./controllers/error');

const app=express();

app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended: true}));

app.use('/admin',adminRoute);

app.use(shopRoute);

app.use(errorHandler.get404);

app.listen(3000);