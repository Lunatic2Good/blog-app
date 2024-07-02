require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const userRouter = require('./routes/users/users');
const postRouter = require('./routes/posts/posts');
const commentRouter = require('./routes/comments/comments');
const globalErrHandler = require('./middlewares/globalHandler');
const Post = require('./models/post/Post');
const { truncatePost } = require('./utils/helpers');
require('./config/dbConnect');

const app = express()

//helpers
app.locals.truncatePost = truncatePost;

//middlewares
//configure ejs
app.set('view engine', 'ejs');
//serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.json()); //pass incoming data
app.use(express.urlencoded({ extended: true })); //pass incoming form data

//method override
app.use(methodOverride('_method'));
//session config
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.DATABASE_URL,
        ttl: 24*60*60, //1 day
    }),
}));

//save the login user into locals
app.use((req, res, next)=>{
    if(req.session.userAuth) {
        res.locals.userAuth = req.session.userAuth;
    }
    else {
        res.locals.userAuth = null;
    }
    next();
});

//render home
app.get('/', async (req, res)=>{
    try {
        const posts = await Post.find().populate('user');
        res.render('index.ejs', { posts }); //where in views folder  or use index as we already declared ejs above cin configure ejs
    } catch (error) {
        res.render('index', { error: error.message });
    }
});

//users route
app.use('/api/v1/users', userRouter);
//posts route
app.use('/api/v1/posts', postRouter);
//comments route
app.use('/api/v1/comments', commentRouter);

//error handler middleware
app.use(globalErrHandler);
// Start the server
const port = process.env.PORT || 9000;
app.listen(port, console.log(`Server started on port ${port}`));