const faqModel = require("../../models/faq");

/**
 * @swagger
 * paths:
 *  /faq:
 *      get:
 *          tags:
 *          - faq
 *          summary: Finds all the faqs and returns them
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
 *               description: Shows all the faqs recorded in the database
 *               schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: integer
 *                          example: 1
 *                      faqs:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  question:
 *                                      type: string
 *                                      example: Where can we find you?
 *                                  answer:
 *                                      type: string
 *                                      example: El Salvador, La Libertad, Colonia las gunaras
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.allFaqs = (req,res,next) =>{
    faqModel.find({}).then(docs=>{
        return res.status(200).json({
            count: docs.length,
            faqs: docs.map(doc =>{
                // Specifies the way the faq doc will be presented and what information will be given to the faq
                return{
                    _id : doc._id,
                    question : doc.question,
                    answer: doc.answer
                }
            }),
            message: "All the FAQs",
        });
    }).catch(err =>{
        return res.status(500).json({
            message: err.message
        });
    });
};