const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

//Set morgan up
//app.use(morgan("dev"));

//MiddleWare used
const CORS = require("./API/v1/middleware/corsSet");
const notFound = require("./API/v1/middleware/notFound");
const errorHandler = require("./API/v1/middleware/errorHandler");

//Tools used
const DB = require("./API/v1/tools/DBConnection");


// Creates a public route for access to documents in the "public" folder
app.use(express.static(path.join(__dirname, "public")));

//Routes used in the API
const swaggerRoutes = require("./API/v1/routes/swagger");
const userRoutes = require("./API/v1/routes/user");
const manualRoutes = require("./API/v1/routes/manual");
const videoRoutes = require("./API/v1/routes/video");
const faqRoutes = require("./API/v1/routes/faq");

//Connection to database
DB(mongoose);
//FireBase(admin, serviceAccount);

//Accepts url bodies that are simple
app.use(bodyParser.urlencoded({extended: false}));

//Enables the read of jsons
app.use(bodyParser.json());

//Stops some CORS problems
app.use(CORS);

// Active endpoints for the API
app.use("/API/v1/swagger", swaggerRoutes);
app.use("/API/v1/user", userRoutes);
app.use("/API/v1/manual", manualRoutes);
app.use("/API/v1/video", videoRoutes);
app.use("/API/v1/faq", faqRoutes);

// Not found route
app.use("*", notFound);
app.use("*", errorHandler);


module.exports = app;