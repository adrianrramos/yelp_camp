const express          = require('express'),
      app              = express(),
      bodyParser       = require('body-parser'),
      mongoose         = require('mongoose'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      methodOverride   = require('method-override'),
      flash            = require('connect-flash'),
      Campground       = require('./models/campground'),
      Comment          = require('./models/comment'),
      User             = require('./models/user'),
      campgroundRoutes = require('./routes/campgrounds'),
      commentRoutes    = require('./routes/comment'),
      indexRoutes      = require('./routes/index'),
      secretMessage    = require('../secretMessage'),
      seedDB           = require('./seeds.js');

mongoose.connect("mongodb://localhost/yelp_camp",
    // Eliminates Deprecation Warnings (tutorial was using MongoDb 4.1)
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

//====================
// PASSPORT CONFIG
//====================
app.use(require('express-session')({
    secret: secretMessage,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passes the user object to every route
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// import routes 
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// connect to server and listen
app.listen(3000,
    () => console.log('yelp camp server v10.0')
);