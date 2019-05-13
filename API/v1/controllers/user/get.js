const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const  hbs = require("nodemailer-express-handlebars"),
    mailerEmail = process.env.MAILER_EMAIL_ID || "auth_email_address@gmail.com",
    mailerPass = process.env.MAILER_PASSWORD || "auth_email_pass"
nodemailer = require("nodemailer");


const smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: mailerEmail,
        pass: mailerPass
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: "API/v1/templates/",
        layoutsDir: "API/v1/templates/"
    },
    viewPath: "API/v1/templates/",
    extName: ".html",
};

smtpTransport.use("compile", hbs(handlebarOptions));

/**
 * @swagger
 * paths:
 *  /user:
 *      get:
 *          tags:
 *          - user
 *          summary: Finds all the users and returns non-dangerous information
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *          responses:
 *              '200':
 *               description: Shows all the users recorded in the database
 *               schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: integer
 *                      users:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/user'
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.allUsers = (req,res,next) =>{
    userModel.find({roles: {$ne: "superadmin"}}).then(docs=>{
        return res.status(200).json({
            count: docs.length,
            users: docs.map(doc =>{
                // Specifies the way the user doc will be presented and what information will be given to the user
                return{
                    _id : doc._id,
                    account : doc.account,
                    email: doc.email,
                    roles : doc.roles,
                    dateCreated : doc.dateCreated,
                    status : doc.status,
                    settings: doc.settings,
                    resetPasswordToken: doc.resetPasswordToken
                }
            }),
            message: "All the users",
        });
    }).catch(err =>{
        return res.status(500).json({
            message: err.message
        });
    });
};
/**
 * @swagger
 * paths:
 *  /user/{idUser}:
 *      get:
 *          tags:
 *          - user
 *          summary: Shows the personal information of a single user in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: idUser
 *              in: path
 *              require: true
 *              description: Unique identifier of the user to find
 *              type: string
 *          responses:
 *              '200':
 *               description: Show the information of a user
 *               schema:
 *                  type: object
 *                  $ref: '#/definitions/user'
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '404':
 *                  description: User not found
 *              '500':
 *                  description: Some kind of error
 */

exports.oneUser = (req,res,next) =>{
    const pathId = req.params.idUser;
    //Finds the document
    userModel.find({_id: pathId})
        //Only gets the following fields
        .select("_id account dateCreated status authorithy")
        .sort({registarAt: -1})
        .then(doc =>{
            if (doc.length>0) {
                return res.status(200).json({
                    userData: doc[0],
                    message: "A single user record",
                });
            }
            return res.status(404).json({
                message: "User record not found",
            });
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};

/**
 * @swagger
 * paths:
 *  /user/token:
 *      get:
 *          tags:
 *          - user
 *          summary: Verifies if a token is still active
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *          responses:
 *              '200':
 *                  description: Show the information of a user
 *              '401':
 *                  description: Your token expired
 */


exports.checkToken = (req,res,next) =>{
    res.status(200).json({
        message: "User verified, please continue to use the API"
    });
};


/**
 * @swagger
 * paths:
 *  /user/token/forgot-password?email=test@email.com:
 *      get:
 *          tags:
 *          - user
 *          summary: Sends an email with token a to change a user password
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: email
 *              in: query
 *              required: true
 *              schema:
 *                  type: string
 *              description: The email of the user that lost the password
 *          responses:
 *              '200':
 *                  description: Kindly check your email for further instructions
 *              '404':
 *                  description: Email not found in database
 *              '500':
 *                  description: Some kind of error
 */

exports.forgotPassword = (req, res, next)=> {
    if(!req.query.email){
        return res.status(422).json({
            message: "Missing fields"
        })
    }
    const result = {};
    userModel.findOne({email: req.query.email}).exec()
        .then(user=>{
            if (!user) {
                return res.status(404).json({
                    message: "Email not found in database",
                });
            }
            const token = jwt.sign({
                idUser: user._id,
                email: user.email
            }, process.env.JSON_WEB_TOKEN_SECRET,{
                expiresIn: "1d"
            });
            result.user = user;
            userModel.updateOne({ _id: result.user._id },
                { resetPasswordToken: token, resetPasswordExpires: Date.now() + 86400000 })
                .exec().then((newUser) => {
                    const data = {
                        to: user.email,
                        from: mailerEmail,
                        template: "forgot-password",
                        subject: "¡La ayuda para tu contraseña ha llegado!",
                        context: {
                            url: "https://bigdreamscoders.github.io/Crese-asistencia-sysadmin/passwordReset.html?token=" + token,
                            name: user.account
                        }
                    };
                    smtpTransport.sendMail(data, (err) =>{
                        if (!err) {
                            return res.status(200).json({ message: "Kindly check your email for further instructions" });
                        } else {
                            return res.status(500).json({ message: err });
                        }
                    });
                })
                .catch(err =>{
                    return res.status(500).json({
                        message: err.message
                    });
                })
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
}

