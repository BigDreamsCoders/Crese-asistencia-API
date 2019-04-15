const userModel = require("../../models/user");

/**
 * @swagger
 * paths:
 *  /user/{idUser}:
 *      delete:
 *          tags:
 *          - user
 *          summary: Deletes a single record of a user
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
 *              description: Unique identifier of the user to delete
 *              type: string
 *          responses:
 *              '200':
 *                  description: User record deleted
 *              '401':
 *                  description: Your lack of permissions prevents you for accessing this route
 *              '404':
 *                  description: User not found
 *              '500':
 *                  description: Some kind of error
 */

exports.deleteUser = (req, res, next)=>{
    const pathId = req.params.idUser;
    userModel.find({_id: pathId}).exec()
        .then(result =>{
            if(result){
                userModel.remove({_id: pathId}).exec()
                    .then(removeResult=>{
                        return res.status(200).json({message:"User record deleted"});
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
            }
            return res.status(404).json({message: "User record not found"});
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};