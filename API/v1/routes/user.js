const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/user/get");
const actionPOST = require("../controllers/user/post");

//Middleware Calls
const vToken = require("../middleware/verifyToken");
const vPermission = require("../middleware/verifyPermission");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: users
 *      description: The API manages a user system
 *
 */

//GET routes
router.get("/",  actionsGET.allUsers);
router.get("/:idUser",   actionsGET.oneUser);
//POST routes
router.post("/", actionPOST.insertUser);
router.post("/login", actionPOST.requestToken);


module.exports = router;