const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/user/get");
const actionsPOST = require("../controllers/user/post");
const actionsDELETE = require("../controllers/user/delete")

//Middleware Calls
const vToken = require("../middleware/verifyToken");
const vPermission = require("../middleware/verifyPermission");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: user
 *      description: This section will describe all the avaible routes that are related to user data model
 *
 */

//GET routes
router.get("/",  actionsGET.allUsers);
router.get("/:idUser",   actionsGET.oneUser);
//POST routes
router.post("/", actionsPOST.insertUser);
router.post("/login", actionsPOST.requestToken);
//DELETE routes
router.delete("/", actionsDELETE.deleteUser);


module.exports = router;