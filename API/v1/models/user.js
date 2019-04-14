const mongoose = require("mongoose");
const shortid = require("shortid");

/**
 *  @swagger
 *  definitions:
 *      user:
 *          description: "Data model for all user in the API"
 *          properties:
 *              account:
 *                  type: string
 *                  description: "The username from the login"
 *                  example: "AlexBig"
 *              email:
 *                  type: string
 *                  description: "The email address used for the login"
 *                  example: "jvalexander@gmail.com"
 *              password:
 *                  type: string
 *                  description: "Secret password of the user"
 *              dateCreated:
 *                  type: string
 *                  description: "When it was added"
 *                  example: "2018-8-3 11:12:40"
 *              status:
 *                  type: integer
 *                  description: "Defines If a user isn't active (0), active (1) or blocked (2)"
 *                  example: 1
 *              roles:
 *                  type: string
 *                  description: "If it's a client or an admin"
 *                  example: "client"
 */

const userSchema = mongoose.Schema({
    _id:{
        type:String,
        default: shortid.generate
    },
    account: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    dateCreated: {type: String, require: true},
    status: {type: Number, default: 1},
    roles: {type: String, default:"client"}
});

module.exports = mongoose.model("user", userSchema);