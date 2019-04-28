const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/manual/get");
const actionsPOST = require("../controllers/manual/post");
const actionsDELETE = require("../controllers/manual/delete");
const actionsUPDATE = require("../controllers/manual/put");

//Middleware Calls
const vToken = require("../middleware/tokenVerify");
const vPermission = require("../middleware/permissionVerify");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: manual
 *      description: This section describes all the available routes that are related to manual data model
 *
 */

//GET endpoints
router.get("/", vToken, vPermission("read", "manual"),  actionsGET.getManuals);
//POST endpoints
router.post("/", vToken, vPermission("create", "manual"), actionsPOST.insertManual);
//DELETE endpoints
router.delete("/:idManual", vToken, vPermission("delete", "manual"), actionsDELETE.deleteManual);
//UPDATE endpoints
router.put("/:idManual", vToken, vPermission("update", "manual"), actionsUPDATE.patchManual);


module.exports = router;