const mongoose = require("mongoose");
const shortid = require("shortid");
const getDate = require("../tools/getDate");

/**
 *  @swagger
 *  definitions:
 *      manual:
 *          description: "Data model for manuals in the API"
 *          properties:
 *              name:
 *                  type: string
 *                  description: "The name of the manual"
 *                  example: "Samsung Dishwasher SDS123"
 *              URL:
 *                  type: string
 *                  description: "The reference of the manual"
 *                  example: "https://externalwebsite.com/manual.pdf"
 *              sourceType:
 *                  type: string
 *                  description: "Description of the type of manual"
 *                  example: "User manual"
 *              dateCreated:
 *                  type: string
 *                  description: "When it was added"
 *                  example: "2018-8-3 11:12:40"
 *              keywords:
 *                  type: array
 *                  description: "Text strings that help to find a record"
 *                  items:
 *                      type: string
 *                      example: "Samsung"
 *              category:
 *                  type: string
 *                  description: "Which of the four categories the manual belongs"
 *                  example:
 *                  - "cámara wifi"
 *                  - "cctv"
 *                  - "gps"
 *                  - "control de acceso"
 *              downloadFactor:
 *                  type: integer
 *                  description: "How many times has the manual been downloaded"
 *                  example: 250
 *              viewFactor:
 *                  type: integer
 *                  description: "How many times has the manual been clicked"
 *                  example: 514
 *              shareFactor:
 *                  type: integer
 *                  description: "How many times has the manual been shared"
 *                  example: 20
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
    name: {type: String, require: true},
    URL: {type: String, require: true},
    sourceType: {type: String, require: true},
    dateCreated: {type: String, default: getDate()},
    keywords: [{type: String}],
    category: {type: String, require: true},
    downloadFactor: {type: Number, default: 0},
    viewFactor: {type: Number, default: 0},
    shareFactor: {type: Number, default: 0},
    creator: { type: String, ref: "user"}
});

module.exports = mongoose.model("manual", manualSchema);