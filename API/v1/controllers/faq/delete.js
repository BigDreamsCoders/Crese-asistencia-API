const faqModel = require("../../models/faq");

/**
 * @swagger
 * paths:
 *  /faq/{idFaq}:
 *      delete:
 *          tags:
 *          - faq
 *          summary: Deletes a single record of a faq
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
 *              required: true
 *              description: Unique identifier of the user to delete
 *              type: string
 *          responses:
 *              '200':
 *                  description: FAQ record deleted
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '404':
 *                  description: FAQ not found
 *              '422':
 *                  description: Missing fields
 *              '500':
 *                  description: Some kind of error
 */

exports.deleteFaq = (req, res, next)=>{
    const pathId = req.params.idFaq;
    if(!pathId){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    faqModel.findOne({_id: pathId}).exec()
        .then(result =>{
            if(result){
                return faqModel.deleteOne({_id: pathId}).exec()
                    .then(removeResult=>{
                        res.status(200).json({message:"FAQ record deleted"});
                    }).catch(err => {
                        res.status(500).json(err);
                    });
            }
            return res.status(404).json({message: "FAQ record not found"});
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};