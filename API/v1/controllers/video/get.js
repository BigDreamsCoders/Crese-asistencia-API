const videoModel = require("../../models/video");

/**
 * @swagger
 * paths:
 *  /video:
 *      get:
 *          tags:
 *          - video
 *          summary: Finds all the videos and displays them
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
 *               description: Shows all the videos recorded in the database
 *               schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: integer
 *                      videoArray:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/video'
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.getVideos = (req,res,next) =>{
    if(!req.body.search || !req.body.category){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const search = "/"+req.body.search+"/";
    const categorySearch = req.body.category;
    videoModel.find({$or:[{keywords: {$regex: search}},{name: {$regex: search}}]},
        {category: categorySearch}).then(docs=>{
        return res.status(200).json({
            count: docs.length,
            videos: docs.map(doc =>{
                // Specifies the way the videos will be presented and what information will be given
                return{
                    _id : doc._id,
                    name : doc.name,
                    URL: doc.URL,
                    sourceType : doc.sourceType,
                    dateCreated : doc.dateCreated,
                    keywords : doc.keywords,
                    category: doc.category,
                    reachFactor: doc.reachFactor,
                    viewFactor: doc.viewFactor,
                    shareFactor: doc.shareFactor
                }
            }),
            message: "All records of the videos",
        });
    }).catch(err =>{
        return res.status(500).json({
            message: err.message
        });
    });
};