const manualModel = require("../../models/manual");

/**
 * @swagger
 * paths:
 *  /manual/{idManual}:
 *      delete:
 *          tags:
 *          - manual
 *          summary: Deletes a single record of a manual
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: idManual
 *              in: path
 *              require: true
 *              description: Unique identifier of the user to delete
 *              type: string
 *          responses:
 *              '200':
 *                  description: Manual record deleted
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '404':
 *                  description: Manual not found
 *              '500':
 *                  description: Some kind of error
 */

exports.deleteManual = (req, res, next)=>{
    const pathId = req.params.idManual;
    manualModel.find({_id: pathId}).exec()
        .then(result =>{
            if(result){
                manualModel.remove({_id: pathId}).exec()
                    .then(removeResult=>{
                        return res.status(200).json({message:"Manual record deleted"});
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
            }
            return res.status(404).json({message: "Manual record not found"});
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};