const manualModel = require("../../models/manual");

/**
 * @swagger
 * paths:
 *  /manual/{idManual}:
 *      put:
 *          tags:
 *          - manual
 *          summary: Updates fields of a specific document of manual
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
 *              required: true
 *              description: Unique identifier of the manual to update
 *            - required: true
 *              name: updateContent
 *              in: body
 *              description: An array of objects that contains the fields and values to be assigned
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      change:
 *                          type: string
 *                          description: what field is going to be modfied
 *                          example: name
 *                      value:
 *                          type: string
 *                          description: if it's going to be disabled or enabled
 *                          example: Retorah bread toaster
 *          responses:
 *              '200':
 *                  description: Manual updated
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.patchManual = (req,res,next)=>{
    const idManual = req.params.idManual;
    const fieldsToChange= {};
    for(const option of req.body.updateContent){
        fieldsToChange[option.change] = option.value;
    }
    manualModel.updateOne({_id: idManual}, { $set : fieldsToChange })
        .exec()
        .then(resultado => {
            res.status(200).json({message: "Manual updated"});
        })
        .catch(err => {
            res.status(500).json(err);
        });
};