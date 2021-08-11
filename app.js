const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const User = require('./models/user');
const errorHandler = require('./controllers/error');
const app = express();

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", 'js.stripe.com'],
            'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            'frame-src': ["'self'", 'js.stripe.com'],
            'font-src': ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
            'img-src': ["'self'", 'chronicle.brightspotcdn.com', 'images.unsplash.com', 'm.media-amazon.com']
        },
    })
)
app.use(compression());
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    User.findById('61124e162cfbf422547afe50')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

app.use('/admin', adminRoute);

app.use(shopRoute);
app.use(authRoute);

app.use(errorHandler.get404);

mongoose.connect(process.env.DATABASE_CONNECT, result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'admin1',
                email: 'admin1@test.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    // const user = new User({
    //     name: 'admin1',
    //     email: 'admin1@test.com',
    //     cart: {
    //         items: []
    //     }
    // });
    // user.save();
    // https.createServer({ key: privateKey, cert: certificate }, app)
    app.listen(process.env.PORT || 3000);
}).catch(err => {
    console.log(err);
})

