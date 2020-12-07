var mongoose        = require('mongoose');
var Register  		= require('./models/userregister'),	     //userregister 	== userregister.js, 	Register  == inside userrregister.js, export
	Space 	  		= require('./models/availablespace');	 //availablespace 	== availablespace.js, 	Space 	  == inside availablespace.js, export
var passport        = require("passport");
var LocalStrategy   = require("passport-local");

passport.use(new LocalStrategy(Register.authenticate()));
passport.serializeUser(Register.serializeUser());
passport.deserializeUser(Register.deserializeUser());

//ADMIN ACCOUNTS => PASSWORD
var pass = "admin";

// ADMIN
// username: Admin
// password: admin

var adminReg = [
    {
        username: "Admin",
        type: "Admin"
    },
]

var avaiSpace = [
    {
        name: "Jkiemangie Residential Rooms",

        location: "Naisipit, Talamban, Cebu City",

        image: "jkiemangie.png",
        
        kitchen: "-",

        bedroom: "1 Bedroom",

        bathroom: "1 Bathroom",

        sqrfootage: "-",

        description: "Jkiemangie features individual rooms for rent, all with airconditioning, cabinet, bedframe and own bathroom. All rooms have their own submeter. They are in a gated building with CCTV cameras. Walking distance to University of San Carlos - Talamban Campus. Contract requires 1 month security deposit and 1 month advance rental for at least 6 months contract.",
     
        rate: "6,500/Month"
    },
    {
        name: "Pacres Dormitory",

        location: "Naisipit, Talamban, Cebu City",

        image: "pacres.png",
        
        kitchen: "-",

        bedroom: "1 Bedroom",

        bathroom: "1 Bathroom",

        sqrfootage: "-",

        description: "Pacres Dormitory envisions to become one of the most preferred dormitories in the locality of Talamban, Cebu City by rendering its beloved tenants high quality service and facilities and providing a well-secured home for everyone. Pacres Dormitory intends to provide its tenants the comfort, accessibility, and safety of a home at a very affordable price. A home, fully equipped, to cater to the essential needs of its tenants for their convenience, a wholesome home away from home.",

        rate: "2,000/Month"
    },
    {
        name: "The Grid",

        location: "Naisipit, Talamban, Cebu City",

        image: "grid.jpg",
        
        kitchen: "-",

        bedroom: "1 Bedroom",

        bathroom: "1 Bathroom",

        sqrfootage: "-",

        description: "Grid  is a well known food park within Talamban. The Grid envisions to provide clean, safe and affordable homes, offices and event spaces for students and professionals. Offering a great environment for working, relaxing, and socializing .They envision to be a great venue for students, designers, architects, musicians, start ups and art enthusiasts to meet over food and drinks. A platform for creatives to express through exhibitions, workshops, events and craft markets. To build their network, find common interests, and share resources with one another. The Grid is no doubt to be one of Cebu’s well-known Creative Hub.",

        rate: "10,000/Month"
    },
    {
        name: "JTH Dormitories",

        location: "Naisipit, Talamban, Cebu City",

        image: "jth.jpg",
        
        kitchen: "1",

        bedroom: "1 Bedroom",

        bathroom: "1 Bathroom",

        sqrfootage: "-",

        description: "JTH Dormitories top priorities are security and comfort. JTH Dormitory is just near an established university called University of San Carlos - Talamban Campus. It is near but not along the mainroad to avoid noise from ever present vehicles and the fumes they emit which is toxic to your health at constant exposure. The facade is built with top quality materials which will prevent fire hazzards. Multiple fire exits are available with extinguishers and with 24/7 security to ensure safety. They also have good drainages for the prevention of floods. Just about 2 minute walking distance from the campus with easy access to public transportation. Security guards available and 16 cctv's on patrol. Hurry and book a room with them as spaces are limited and filling up!",

        rate: "10,000/Month"
    },


]

function spaceplusdb() {
    //REMOVE ALL POSTS
    Space.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed Posts");
        //ADD POSTS
        avaiSpace.forEach(function(seed){
            Space.create(seed, function(err){
                if(err) {
                    console.log(err)
                } else {
                    console.log("Post Added");
                }
            });
        });
    });
    //REMOVE ALL USERS
    Register.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed Accounts");
        //ADD ACCOUNTS
        adminReg.forEach(function(userSeed){
            Register.register(userSeed, pass, function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Account Added");
                }
            });
        });
    });
}

module.exports = spaceplusdb;