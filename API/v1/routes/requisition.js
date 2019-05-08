const express = require("express");
const router = express.Router();
const actionsPOST = require("../controllers/requisition/post");



//Middleware Calls
const vToken = require("../middleware/tokenVerify");
const vPermission = require("../middleware/permissionVerify");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: requisition
 *      description: This section describes all the available routes that are related to requisition
 *
 */

//GET endpoints
router.post("/", vToken, vPermission("create", "requisition"),  actionsPOST.requestPrice);


module.exports = router;