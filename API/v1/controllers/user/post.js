const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


/**
 * @swagger
 * paths:
 *  /user:
 *      post:
 *          tags:
 *          - user
 *          summary: Creates a user in the database
 *          produces:
 *          - "application/json"
 *          parameters:
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
 *                          passsword:
 *                              type: password
 *                              description: The personal secret string
 *                              example: bigSecret
 *                          account:
 *                              type: string
 *                              description: Nickname, the way it will be refered
 *                              example: AlexBig
 *              -   in: path
 *                  name: adminSecret
 *                  description: "The secret password to create admins"
 *          responses:
 *                  '200':
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
                    password: hash,
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
 *                      emailAddress:
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
 *                  description: It will return a object with information
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
                    expiresIn: "3h"
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