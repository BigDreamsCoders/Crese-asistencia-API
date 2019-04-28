const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/user/get");
const actionsPOST = require("../controllers/user/post");
const actionsDELETE = require("../controllers/user/delete");
const actionsUPDATE = require("../controllers/user/put");

//Middleware Calls
const vToken = require("../middleware/tokenVerify");
const vPermission = require("../middleware/permissionVerify");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: user
 *      description: This section will describe all the avaible routes that are related to user data model
 *
 */

//GET endpoints
router.get("/", vToken, vPermission("read", "user"),  actionsGET.allUsers);
router.get("/token", vToken, actionsGET.checkToken);
router.get("/forgot-password", actionsGET.forgotPassword);
router.get("/reset-password", vToken, actionsGET.resetPassword);
router.get("/:idUser", vToken, vPermission("read", "user"),   actionsGET.oneUser);
//POST endpoints
router.post("/", actionsPOST.insertUser);
router.post("/admin", vToken, vPermission("create", "admin"), actionsPOST.insertAdmin);
router.post("/login", actionsPOST.requestToken);
//DELETE endpoints
router.delete("/:idUser", vToken, vPermission("delete", "user"),  actionsDELETE.deleteUser);
//UPDATE endpoints
router.put("/settings", vToken, actionsUPDATE.patchSettings);


module.exports = router;