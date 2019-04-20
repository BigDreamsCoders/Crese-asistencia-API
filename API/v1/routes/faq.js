const express = require("express");
const router = express.Router();
const actionsGET = require("../controllers/faq/get");
const actionsPOST = require("../controllers/faq/post");
const actionsDELETE = require("../controllers/faq/delete");
const actionUPDATE = require("../controllers/faq/put");


//Middleware Calls
const vToken = require("../middleware/verifyToken");
const vPermission = require("../middleware/verifyPermission");

//General description of the whole route
/**
 *   @swagger
 *   tags:
 *      name: faq
 *      description: This section will describe all the avaible routes that are related to faq data model
 *
 */

//GET endpoints
router.get("/", vToken, vPermission("read", "faq"),  actionsGET.allFaqs);
//POST endpoints
router.post("/", vToken, vPermission("create", "faq"), actionsPOST.insertFaq);
//DELETE endpoints
router.delete("/:idFaq", vToken, vPermission("delete", "faq"), actionsDELETE.deleteFaq);
//PUT endpoints
router.put("/:idFaq", vToken, vPermission("update", "faq"), actionUPDATE.patchFaq);



module.exports = router;