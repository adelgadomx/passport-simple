// Requires main
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passportLocal = require("passport-local").Strategy;
const morgan = require("morgan");

const app = express();

//solo Dev
app.use(morgan('dev'));
// Inits
app.set('port', 3000);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser('MiUltraSecreto'));
app.use(session({
    secret: "MiUltraSecreto",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(function(username, password, done) {
    if(username==='adelgado' && password === "facilito")
      return done(null, {id:1, name: "Antonio Delgado"});
    // si fallo el anterior se niega el acceso
    done(null, false);
}));

// Serialize
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deSerialize
passport.deserializeUser(function(id, done) {
    done(null, {id: 1, name: "adelgado"});
})

// Routes
app.get('/', (req, res,next) => {
    if(req.isAuthenticated()) return next();
    else res.redirect("/login");
},
(req, res) => {
    res.send("User logged");
});

app.get('/login', (req, res) => {
    res.render("index")
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.listen(app.get('port'), () =>{
    console.log('Listenning on port ' +  app.get('port'));
})