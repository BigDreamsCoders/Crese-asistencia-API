const faqModel = require("../../models/faq");

/**
 * @swagger
 * paths:
 *  /faq:
 *      post:
 *          tags:
 *          - faq
 *          summary: Creates a faq in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *              -   in: header
 *                  name: Authorization
 *                  description: Authorization token format must be the following 'Bearer **********'
 *                  required: true
 *                  type: string
 *              -   in: body
 *                  name: FAQ Structure
 *                  description: FAQ object to be inserted in the database
 *                  required: true
 *                  schema:
 *                      type: object
 *                      properties:
 *                          question:
 *                              type: string
 *                              example: Where can we find you?
 *                          answer:
 *                              type: string
 *                              example: El Salvador, La Libertad, Colonia las gunaras
 *          responses:
 *                  '201':
 *                      description: FAQ record added
 *                  '401':
 *                      description: Your lack of permissions prevents you from accessing this route
 *                  '422':
 *                      description: FAQ couldn't be created
 *                  '500':
 *                      description: Some kind of error
 */

exports.insertFaq= (req, res, next) => {
    if(!req.body.question || !req.body.answer){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const faqBody = {
        question: req.body.question,
        answer : req.body.answer,
        creator: req.userData.idUser
    };
    const newFaq = new faqModel(faqBody);
    newFaq.save()
        .then((result) =>{
            return res.status(201).json({
                userData: newFaq,
                message: "FAQ record created"
            })
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};
