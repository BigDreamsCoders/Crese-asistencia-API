const userModel = require("../../models/user");

/**
 * @swagger
 * paths:
 *  /user:
 *      get:
 *          tags:
 *          - user
 *          summary: Finds all the users and displays them
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
 *                      userArray:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/user'
 *              '401':
 *                  description: Your lack of permissions prevents you for accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.allUsers = (req,res,next) =>{
    userModel.find({}).then(docs=>{
        return res.status(200).json({
            count: docs.length,
            users: docs.map(doc =>{
                // Specifies the way the user doc will be presented and what information will be given to the user
                return{
                    _id : doc._id,
                    account : doc.account,
                    dateCreated : doc.dateCreated,
                    status : doc.status,
                    authorithy : doc.authorithy
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
 *                  description: Your lack of permissions prevents you for accessing this route
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