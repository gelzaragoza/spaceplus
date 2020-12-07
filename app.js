//PACKAGES
var express 				= require('express'),
	bodyParser 				= require('body-parser'),
	cookieParser 			= require('cookie-parser'),
	mongoose 				= require('mongoose'),
	expressSanitizer 		= require('express-sanitizer'),
	passport 				= require('passport'),
	methodOverride 			= require('method-override'),
	flash 					= require('connect-flash'),
	session 				= require('express-session'),
	passportLocalMongoose 	= require('passport-local-mongoose'),
	localStrategy 			= require('passport-local'),
	app 					= express();
	
//MODELS
var Register  		= require('./models/userregister'),	 //userregister 	== userregister.js, 	Register  == inside userrregister.js, export
	Space 	  		= require('./models/availablespace'),	 //availablespace 	== availablespace.js, 	Space 	  == inside availablespace.js, export
	spaceplusdb 	= require('./seed');

//CONNECT TO DATABASE
mongoose.connect('mongodb://localhost/spaceplusdb', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

//VAR INITIALIZATION
app.use(express.json());
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));

//SEED = INSERT DATA TO DATABASE SCHEMA AUTOMATICALLY
spaceplusdb();

app.use(require("express-session")({
	secret: "It is a secret.",
	resave: false,
	saveUninitialized: false
}));

//FOR REGISTER-LOGIN AUTHENTICATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

app.use(flash());
app.use(function(req, res, next){
	res.locals.currentRegister = req.user;
	res.locals.success 		   = req.flash('success');
	res.locals.error 		   = req.flash('error');
	next();
})

// -------------------------ROUTING-------------------------//

//LOGIN
app.get("/", (req, res) => {
	res.locals.title="SpacePlus | Login";
    res.render("login");
});

//HANDLING LOGIN LOGIC
app.post("/userlog", passport.authenticate('local', 
    {
        successRedirect: "/index",
        failureRedirect: "/",
    }), function(req, res){
});

//REGISTER
app.get("/register", function (req, res) {
    res.locals.title = "SpacePlus | Sign Up";
    res.render("register");
});

//HANDLING SIGN UP LOGIC
app.post("/register", function (req, res) {
	res.locals.title = "SpacePlus | Sign Up";
    Register.register(new Register({
        username: req.body.username}),
        req.body.password,
        (error, user) => {
            if(error) {
                console.log("Insertion Failed.");
                return res.render("register");
            }else{
                console.log("User registration was successful.");
                res.redirect("/");
            }
    });
});

//LOGOUT
app.get("/", function(req, res){
	req.logout();
	req.flash("success", "LOGGED YOU OUT!");
	res.redirect("/");
 });

//AUTHENTICATION
function authCheck(req, res, next){
	if(req.isAuthenticated()) { //CORRECT LOGIN
		req.isLogged = true;
		return next(); //PROCEEDS TO THE NEXT FUNCTION
	}
	res.redirect("/"); 
}

//GET INFO FROM THE DATABASE [HOME]
app.get("/index", authCheck, (req, res) => {
	//INPUT COMMANDS BEFORE EXECUTING:
	//md \data\db
	//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"
	//(separate cmd) "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
	Space.find({}, (error, post) => {
		if(error) {
			console.log("Error retrieving");
		} else {
			console.log(post);
			res.render("index", {post : post, currentRegister : req.user});
		}
	});
});

//GET INFO FROM THE DATABASE [ABOUT]
app.get("/about", authCheck, (req, res) => {
	//INPUT COMMANDS BEFORE EXECUTING:
	//md \data\db
	//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"
	//(separate cmd) "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
	Space.find({}, (error, post) => {
		if(error) {
			console.log("Error retrieving");
		} else {
			console.log(post);
			res.render("about", {post : post, currentRegister : req.user});
		}
	});
});

//GET INFO FROM THE DATABASE [POST]
app.get("/manageSpaces", authCheck, function(req, res){
	//INPUT COMMANDS BEFORE EXECUTING:
	//md \data\db
	//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"
	//(separate cmd) "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
	Space.find({}, (error, post) => {
		if(error) {
			console.log("Error retrieving");
		} else {
			console.log(post);
			res.render("manageSpaces", {post : post, currentRegister : req.user});
		}
	});
});

//CREATE INFO FOR THE DATABASE [POST]
app.post("/manageSpaces", function(req, res) {
	req.body.post.body = req.sanitize(req.body.post.body);
	Space.create(req.body.post, (error, newSpace) => {
		if(error) {
			console.log("Insertion Error");
		} else {
			console.log("Insertion Successful");
			res.redirect("/manageSpaces");
		}
	});
});

//DELETE INFO FROM THE DATABASE [POST]
app.delete("/manageSpaces/:id", (req, res) => {
	Space.findByIdAndRemove(req.params.id, (error) => {
		if(error) {
			console.log("Deletion Error");
			res.redirect("/index");
		} else {
			res.redirect("/manageSpaces");
		}
	});
});

//EDIT INFO FROM THE DATABASE [POST]
app.get("/manageSpaces/:id/updateSpace" ,(req, res) => {
    Space.findById(req.params.id, (error, post) => {
        if(error) {
			console.log("Update Error");
            res.redirect("/manageSpaces");
        } else {
            res.render("updateSpace", {post: post});
        }
    });
});

//UPDATE INFO OF THE DATABASE [POST]
app.put("/manageSpaces/:id", (req, res) => {
    req.body.post.body = req.sanitize(req.body.post.body);
    Space.findByIdAndUpdate(req.params.id, req.body.post, (error, updatedSpace) => {
        if(error) {
			console.log("Update Failed");
            res.redirect("/manageSpaces");
        } else {
            res.redirect("/manageSpaces");
        }
    });
});

//GET INFO FROM THE DATABASE [POST]
app.get("/addSpace", authCheck, function(req, res){
	//INPUT COMMANDS BEFORE EXECUTING:
	//md \data\db
	//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe"
	//(separate cmd) "C:\Program Files\MongoDB\Server\4.2\bin\mongo.exe"
	Space.find({}, (error, post) => {
		if(error) {
			console.log("Error retrieving");
		} else {
			console.log(post);
			res.render("addSpace", {post : post, currentRegister : req.user});
		}
	});
});

//CREATE INFO FOR THE DATABASE [POST]
app.post("/addSpace", function(req, res) {
	req.body.post.body = req.sanitize(req.body.post.body);
	Space.create(req.body.post, (error, newSpace) => {
		if(error) {
			console.log("Insertion Error");
		} else {
			console.log("Insertion Successful");
			res.redirect("/addSpace");
		}
	});
});

//CREATE POST
app.get("/addSpace", authCheck, function(req, res){
	res.locals.title="SpacePlus | Add Space";
	res.render("addSpace", {currentRegister: req.user});
});

//ERROR HANDLING
app.get('*', function(req, res){
	res.send("<h3>ERROR 404</h3><p>The URL you requested is not found.</p>");
});

//SERVER
app.listen(3000, function(){
	console.log("SpacePlus - Server is running.");
});