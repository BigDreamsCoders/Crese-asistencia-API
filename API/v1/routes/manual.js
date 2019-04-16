const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/manual/get");
const actionsPOST = require("../controllers/manual/post");
const actionsDELETE = require("../controllers/manual/delete");


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
router.get("/", vToken, vPermission("read", "manual"),  actionsGET.getManuals);
//POST routes
router.post("/", vToken, vPermission("create", "manual"), actionsPOST.insertManual);
//DELETE routes
router.delete("/:idManual", vToken, vPermission("delete", "manual"), actionsDELETE.deleteManual);



module.exports = router;