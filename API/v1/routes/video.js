const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/video/get");


//Middleware Calls
const vToken = require("../middleware/verifyToken");
const vPermission = require("../middleware/verifyPermission");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: video
 *      description: This section will describe all the avaible routes that are related to video data model
 *
 */

//GET routes
router.get("/",  actionsGET.getVideos);



module.exports = router;