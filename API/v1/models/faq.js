const mongoose = require("mongoose");
const shortid = require("shortid");
const getDate = require("../tools/getDate");

/**
 *  @swagger
 *  definitions:
 *      faq:
 *          description: "Data model for FAQs in the API"
 *          properties:
 *              question:
 *                  type: string
 *                  description: The frequently asked questions
 *                  example: Where can we find you?
 *              answer:
 *                  type: string
 *                  description: The answer to the question
 *                  example: El Salvador, La Libertad, Colonia las gunaras
 *              creator:
 *                  type: string
 *                  description: "The identifier of the user that made this document"
 *                  example: NKZBlvbHP
 */

const manualSchema = mongoose.Schema({
    _id:{
        type:String,
        default: shortid.generate
    },
    question: {type: String, require: true},
    answer: {type: String, require: true},
    dateCreated: {type: String, default: getDate()},
    creator: { type: String, ref: "user"}
});

module.exports = mongoose.model("FAQ", manualSchema);