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
 *                  '201':
 *                      description: Manual record added
 *                  '401':
 *                      description: Your lack of permissions prevents you from accessing this route
 *                  '422':
 *                      description: Manual couldn't be created
 *                  '500':
 *                      description: Some kind of error
 */

exports.insertManual= (req, res, next) => {
    if(!req.body.name || !req.body.URL || !req.body.sourceType ||
        !req.body.dateCreated || !req.body.keywords || !req.body.category){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const manualBody = {
        name : doc.name,
        URL: doc.URL,
        sourceType : doc.sourceType,
        keywords : doc.keywords,
        category: doc.category
    };
    const newManual = new manualModel(manualBody);
    newManual.save()
        .then((result) =>{
            return res.status(201).json({
                userData: newManual,
                message: "Manual record created"
            })
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};