const faqModel = require("../../models/faq");

/**
 * @swagger
 * paths:
 *  /faq/{idFaq}:
 *      put:
 *          tags:
 *          - faq
 *          summary: Updates fields of a specific document of FAQ
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: idFaq
 *              in: path
 *              require: true
 *              description: Unique identifier of the FAQ to update
 *              type: string
 *            - require: true
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
 *                          example: answer
 *                      value:
 *                          type: string
 *                          description: if it's going to be disabled or enabled
 *                          example: We are located in San Miguel
 *          responses:
 *              '200':
 *                  description: FAQ updated
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.patchFaq = (req,res,next)=>{
    const idFaq = req.params.idFaq;
    const fieldsToChange= {};
    for(const option of req.body.updateContent){
        fieldsToChange[option.change] = option.value;
    }
    faqModel.updateOne({_id: idFaq}, { $set : fieldsToChange })
        .exec()
        .then(resultado => {
            res.status(200).json({message: "FAQ updated"});
        })
        .catch(err => {
            res.status(500).json(err);
        });
};