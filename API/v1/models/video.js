const mongoose = require("mongoose");
const shortid = require("shortid");
const getDate = require("../tools/getDate");

/**
 *  @swagger
 *  definitions:
 *      video:
 *          description: "Data model for videos in the API"
 *          properties:
 *              name:
 *                  type: string
 *                  description: "The name of the video"
 *                  example: "Samsung Earphone Repair"
 *              URL:
 *                  type: string
 *                  description: "The reference of the video"
 *                  example: "https://www.youtube.com/watch?v=zw7OePH-d6k"
 *              sourceType:
 *                  type: string
 *                  description: "Description of the type of video"
 *                  example: "Youtube video for repairs"
 *              dateCreated:
 *                  type: string
 *                  description: "When it was added"
 *                  example: "2018-8-3 11:12:40"
 *              keywords:
 *                  type: array
 *                  description: "Text strings that help to find a record"
 *                  items:
 *                      type: string
 *                      example: "Iphone"
 *              category:
 *                  type: string
 *                  description: "Which of the four categories the video belongs"
 *                  example:
 *                  - "cámara wifi"
 *                  - "cctv"
 *                  - "gps"
 *                  - "control de acceso"
 *              reachFactor:
 *                  type: integer
 *                  description: "How many times has the video been opened through the app"
 *                  example: 102
 *              viewFactor:
 *                  type: integer
 *                  description: "How many times has the video been clicked"
 *                  example: 210
 *              shareFactor:
 *                  type: integer
 *                  description: "How many times has the video been shared"
 *                  example: 123
 *              creator:
 *                  type: string
 *                  description: "The identifier of the user that made this document"
 *                  example: NKZBlvbHP
 */

const videoSchema = mongoose.Schema({
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
    reachFactor: {type: String, default: 0},
    viewFactor: {type: Number, default: 0},
    shareFactor: {type: Number, default: 0},
    creator: { type: String, ref: "user"}
});

module.exports = mongoose.model("video", videoSchema);