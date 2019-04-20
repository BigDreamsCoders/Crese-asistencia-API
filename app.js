const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

//Set morgan up
//app.use(morgan("dev"));

// Creates a public route for access to documents in the "public" folder
app.use(express.static(path.join(__dirname, "public")));

//Routes used in the API
const swaggerRoutes = require("./API/v1/routes/swagger");
const userRoutes = require("./API/v1/routes/user");
const manualRoutes = require("./API/v1/routes/manual");
const videoRoutes = require("./API/v1/routes/video");
const faqRoutes = require("./API/v1/routes/faq");

//Connection to database
mongoose.connect(
    process.env.MONGOOSE_CONN,
    {useNewUrlParser: true })
    .then(answer=>{
        console.log("Successfully connected to database");
        
    })
    .catch(err=>{
        console.log("Not connected to database " + err);
    });

/*userModel.deleteMany({}).exec().then(result => {
    console.log("Users deleted");
}).catch(err => {
    console.log("Problem when trying to delete all");
});*/

//Accepts url bodies that are simple
app.use(bodyParser.urlencoded({extended: false}));
//Enables the read of jsons
app.use(bodyParser.json());

//Stops some CORS problems
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});


// Active endpoints for the API
app.use("/API/v1/swagger", swaggerRoutes);
app.use("/API/v1/user", userRoutes);
app.use("/API/v1/manual", manualRoutes);
app.use("/API/v1/video", videoRoutes);
app.use("/API/v1/faq", faqRoutes);

module.exports = app;