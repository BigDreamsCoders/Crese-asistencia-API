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
 *      post:
 *          tags:
 *          - user
 *          summary: Creates an user in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *              -   in: body
 *                  name: User structure
 *                  description: User object to be inserted in the database
 *                  required: true
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: The user email address
 *                              example: 00062816@uca.edu.sv
 *                          password:
 *                              type: password
 *                              description: The personal secret string
 *                              example: bigSecret
 *                          account:
 *                              type: string
 *                              description: Nickname, the way it will be refered
 *                              example: AlexBig
 *          responses:
 *                  '201':
 *                      description: User record/s added
 *                  '422':
 *                      description: User couldn't be created
 *                  '500':
 *                      description: Some kind of error
 */

exports.insertUser= (req, res, next) => {
    //Verify if a user exists with the same email and name
    if(!req.body.account || !req.body.email || !req.body.password){
        return res.status(422).json({
            message: "Missing fields"
        })
    }
    userModel.find({$or: [
        {email: req.body.email},
        {account:  req.body.account}
    ]})
        .exec()
        .then(user =>{
            //One user already has a email or account in use
            if(user.length>= 1){
                return res.status(422).json({
                    message: "Credentials in use",
                });
            }
            bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS), (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        message: err.message
                    });
                }
                const userBody = {
                    account: req.body.account,
                    email: req.body.email,
                    password: hash
                };
                const newUser = new userModel(userBody);
                newUser.save()
                    .then((result) =>{
                        return res.status(201).json({
                            userData: newUser,
                            message: "User record created"
                        })
                    }).catch(err =>{
                        return res.status(500).json({
                            message: err.message
                        });
                    });
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
 *  /user/admin:
 *      post:
 *          tags:
 *          - user
 *          summary: Creates an admin user in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *              -   in: header
 *                  name: Authorization
 *                  description: Authorization token format must be the following 'Bearer **********'
 *                  required: true
 *                  type: string
 *              -   in: body
 *                  name: User structure
 *                  description: User information to inserted in the database
 *                  required: true
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: The user email address
 *                              example: 00062816@uca.edu.sv
 *                          password:
 *                              type: password
 *                              description: The personal secret string
 *                              example: bigSecret
 *                          account:
 *                              type: string
 *                              description: Nickname, the way it will be refered
 *                              example: AlexBig
 *          responses:
 *                  '201':
 *                      description: User record/s added
 *                  '401':
 *                      description: Your lack of permissions prevents you from accessing this route
 *                  '422':
 *                      description: User couldn't be created
 *                  '500':
 *                      description: Some kind of error
 */

exports.insertAdmin= (req, res, next) => {
    //Verify if a user exists with the same email and name
    if(!req.body.account || !req.body.email || !req.body.password){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    userModel.find({$or: [
        {email: req.body.email},
        {account:  req.body.account}
    ]})
        .exec()
        .then(user =>{
            //One user already has a email or account in use
            if(user.length>= 1){
                return res.status(422).json({
                    message: "Credentials in use",
                });
            }
            bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS), (err,hash)=>{
                if(err){
                    return res.status(500).json({
                        message: err.message
                    });
                }
                const userBody = {
                    account: req.body.account,
                    email: req.body.email,
                    password: hash,
                    roles: req.body.roles
                };
                const newUser = new userModel(userBody);
                newUser.save()
                    .then((result) =>{
                        return res.status(201).json({
                            userData: newUser,
                            message: "User record created"
                        })
                    }).catch(err =>{
                        /*res.status(422).json({
                            message: "Record had a conflict",
                        });*/
                        return res.status(500).json({
                            message: err.message
                        });
                    });
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
 *  /user/login:
 *      post:
 *          tags:
 *          - user
 *          summary: Verifies a user identity to return a token
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Email Login
 *              in: body
 *              description: Login method making use of the email address
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: 00062816@uca.edu.sv
 *                      password:
 *                          type: string
 *                          example: bigSecret
 *            - name: Account Login
 *              in: body
 *              description: Login method using the account identifier
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      account:
 *                          type: string
 *                          example: AlexBig
 *                      password:
 *                          type: string
 *                          example: bigSecret
 *          responses:
 *              '200':
 *                  description: It will return a token object
 *                  schema:
 *                     type: object
 *                     properties:
 *                          token:
 *                              type: string
 *              '401':
 *                  description: Authentication failed
 *              '403':
 *                  description: Your account has been blocked for security issues
 */

exports.requestToken = (req,res,next)=>{
    userModel.findOne({$or: [{email: req.body.email}, {account: req.body.account}]}).exec().then(doc =>{
        if(!doc){
            return res.status(401).json({
                message: "Authentication failed",
            });
        }
        if(doc.status==2){
            return res.status(403).json({
                message: "Your account has been blocked for security issues"
            })
        }
        bcrypt.compare(req.body.password, doc.password, (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }
            if(result){
                const token = jwt.sign({
                    idUser: doc._id,
                    account: doc.account,
                    email: doc.email,
                    roles: doc.roles,
                    status: doc.status
                }, process.env.JSON_WEB_TOKEN_SECRET,{
                    expiresIn: "365d"
                });
                return res.status(200).json({
                    token : token,
                    message: "Here is your token"
                });
            }
            return res.status(401).json({
                message: "Authentication failed",
            });
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
 *  /user/token/reset-password:
 *      post:
 *          tags:
 *          - user
 *          summary: Resets the password to a new one
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Reset info
 *              in: body
 *              description: Login method making use of the email address
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      newPassword:
 *                          type: string
 *                          example: stringtext
 *                      verifyPassword:
 *                          type: string
 *                          example: stringtext
 *                      token:
 *                          type: string
 *                          example: tokengiven
 *          responses:
 *              '200':
 *                  description: Kindly check your email for further instructions
 *              '401':
 *                  description: Password reset token is invalid or has expired
 *              '422':
 *                  description: Passwords issue
 *              '500':
 *                  description: Some kind of error
 */

exports.resetPassword = (req, res, next)=> {
    if(!req.body.newPassword || !req.body.verifyPassword || !req.body.token){
        return res.status(422).json({
            message: "Add the new password"
        });
    }
    userModel.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: {
            $gt: Date.now()}
    }).exec().then((user) =>{
        if (user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                bcrypt.hash(req.body.newPassword, parseInt(process.env.SALT_ROUNDS), (err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            message: err.message
                        });
                    }
                    user.password = hash;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                message: err
                            });
                        }
                        const data = {
                            to: user.email,
                            from: mailerEmail,
                            template: "reset-password",
                            subject: "Password Reset Confirmation",
                            context: {
                                name: user.account
                            }
                        };
                        smtpTransport.sendMail(data, (err) =>{
                            if (!err) {
                                return res.status(200).json({ message: "Password reset" });
                            } else {
                                return res.status(500).json({ message: err });
                            }
                        });
                    });
                })
            }
            else{
                return res.status(422).send({
                    message: "Passwords issue"
                });
            }
        }
        else{
            return res.status(401).send({
                message: "Password reset token is invalid or has expired"
            });
        }
        
    }).catch(err =>{
        return res.status(500).json({
            message: err.message
        });
    });;
};