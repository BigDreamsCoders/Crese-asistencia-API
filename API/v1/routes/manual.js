const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/manual/get");


//Middleware Calls
const vToken = require("../middleware/verifyToken");
const vPermission = require("../middleware/verifyPermission");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: manual
 *      description: This section will describe all the avaible routes that are related to manual data model
 *
 */

//GET routes
router.get("/",  actionsGET.getManuals);



module.exports = router;