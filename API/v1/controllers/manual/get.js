const manualModel = require("../../models/manual");

/**
 * @swagger
 * paths:
 *  /manual?search=Samsung&category=cctv:
 *      get:
 *          tags:
 *          - manual
 *          summary: Finds manuals by its search and category
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: search
 *              in: query
 *              schema:
 *                  type: string
 *              description: A string text that the manual main contain in its keywords or name.
 *            - name: category
 *              in: query
 *              schema:
 *                  type: string
 *              description: Defines what category will the search
 *          responses:
 *              '200':
 *               description: Shows all the manuals recorded in the database
 *               schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: integer
 *                      manualArray:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/manual'
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '422':
 *                  description: Missing fields
 *              '500':
 *                  description: Some kind of error
 */

exports.getManuals = (req,res,next) =>{
    if(!req.query.search || !req.query.category){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const search = "/"+req.query.search+"/";
    const categorySearch = req.query.category;
    manualModel.find({$or:[{keywords: {$regex: search}},{name: {$regex: search}}]},
        {category: categorySearch}).then(docs=>{
        // Specifies the way the manuals will be presented and what information will be given
        return res.status(200).json({
            count: docs.length,
            manuals: docs.map(doc =>{
                return{
                    _id : doc._id,
                    name : doc.name,
                    URL: doc.URL,
                    sourceType : doc.sourceType,
                    dateCreated : doc.dateCreated,
                    keywords : doc.keywords,
                    category: doc.category,
                    downloadFactor: doc.downloadFactor,
                    viewFactor: doc.viewFactor,
                    shareFactor: doc.shareFactor
                }
            }),
            message: "All the manuals",
        });
    }).catch(err =>{
        return res.status(500).json({
            message: err.message
        });
    });
};