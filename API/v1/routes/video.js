const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/video/get");
const actionsPOST = require("../controllers/video/post");
const actionsDELETE = require("../controllers/video/delete");
const actionsUPDATE = require("../controllers/video/put");

//Middleware Calls
const vToken = require("../middleware/tokenVerify");
const vPermission = require("../middleware/permissionVerify");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: video
 *      description: This section describes all the available routes that are related to video data model
 *
 */

//GET endpoints
router.get("/", vToken, vPermission("read", "video"),   actionsGET.getVideos);
//POST endpoints
router.post("/", vToken, vPermission("create", "video"), actionsPOST.insertVideo);
//DELETE endpoints
router.delete("/:idVideo", vToken, vPermission("delete", "video"), actionsDELETE.deleteVideo);
//UPDATE endpoints
router.put("/:idVideo", vToken, vPermission("update", "video"), actionsUPDATE.patchVideo);


module.exports = router;