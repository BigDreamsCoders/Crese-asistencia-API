const mongoose = require("mongoose");
const shortid = require("shortid");
const getDate = require("../tools/getDate");

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
 *              resetPasswordExpires:
 *                  type: string
 *                  description: How much time left until the token expries. It last one day
 *              resetPasswordToken:
 *                  type: string
 *                  description: The token saved for the password reset
 *              settings:
 *                  type: object
 *                  properties:
 *                      notifications:
 *                          type: string
 *                          description: If the user is going to receive notifications or not
 *                      sounds:
 *                          type: string
 *                          description: Establish if the user wants SFX in the platform
 *                      darkMode:
 *                          type: string
 *                          description: What color scheme it wants
 */

const userSchema = mongoose.Schema({
    _id:{
        type:String,
        default: shortid.generate
    },
    account: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    dateCreated: {type: String, default: getDate()},
    status: {type: Number, default: 1},
    roles: {type: String, default:"client"},
    settings: {
        notifications: {type: String, default: "enabled"},
        sounds: {type: String, default: "enabled"},
        darkMode: {type: String, default: "enabled"}
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: String}
});

module.exports = mongoose.model("user", userSchema);