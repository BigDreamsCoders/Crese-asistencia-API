const videoModel = require("../../models/video");

/**
 * @swagger
 * paths:
 *  /video?search=Samsung&category=cctv:
 *      get:
 *          tags:
 *          - video
 *          summary: Find videos by its search and category
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
 *              description: A string of text that the video contains, this then will be used to search the fields keywords and name
 *            - name: category
 *              in: query
 *              schema:
 *                  type: string
 *              description: Defines which category is going to be search
 *          responses:
 *              '200':
 *               description: Shows all the videos recorded in the database
 *               schema:
 *                  type: object
 *                  properties:
 *                      count:
 *                          type: integer
 *                      videos:
 *                          type: array
 *                          items:
 *                              $ref: '#/definitions/video'
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.getVideos = (req,res,next) =>{
    if(!req.query.search || !req.query.category){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const search = req.query.search;
    const categorySearch = req.query.category;
    videoModel.find({
        $and:[{
            $or:[
                {keywords: {$regex: `.*${search}.*`}},
                {name: {$regex: `.*${search}.*`}}
            ]
        },{
            category: `${categorySearch}`
        }
        ]
    }).then(docs=>{
        // Specifies the way the videos will be presented and what information will be given
        return res.status(200).json({
            count: docs.length,
            videos: docs.map(doc =>{
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