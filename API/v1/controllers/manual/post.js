const manualModel = require("../../models/manual");

/**
 * @swagger
 * paths:
 *  /manual:
 *      post:
 *          tags:
 *          - manual
 *          summary: Creates a manual in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *              -   in: header
 *                  name: Authorization
 *                  description: Authorization token format must be the following 'Bearer **********'
 *                  required: true
 *                  type: string
 *              -   in: body
 *                  name: Manual Structure
 *                  description: Manual information to inserted in the database
 *                  required: true
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: "The name of the manual"
 *                              example: "Samsung Dishwasher SDS123"
 *                          URL:
 *                              type: string
 *                              description: "The reference of the manual"
 *                              example: "https://externalwebsite.com/manual.pdf"
 *                          sourceType:
 *                              type: string
 *                              description: "Description of the type of manual"
 *                              example: "User manual"
 *                          dateCreated:
 *                              type: string
 *                              description: "When it was added"
 *                              example: "2018-8-3 11:12:40"
 *                          keywords:
 *                              type: array
 *                              description: "Text strings that help to find a record"
 *                              items:
 *                                  type: string
 *                                  example: "Samsung"
 *                          category:
 *                              type: string
 *                              description: "Which of the four categories the manual belongs"
 *                              example:
 *                              - "cámara wifi"
 *                              - "cctv"
 *                              - "gps"
 *                              - "control de acceso"
 *          responses:
 *                  '200':
 *                      description: manual record added
 *                  '422':
 *                      description: manual couldn't be added
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
        });
};