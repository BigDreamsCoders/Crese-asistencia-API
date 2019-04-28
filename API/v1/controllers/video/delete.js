const videoModel = require("../../models/video");

/**
 * @swagger
 * paths:
 *  /video/{idVideo}:
 *      delete:
 *          tags:
 *          - video
 *          summary: Deletes a single record of a video
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: idVideo
 *              in: path
 *              required: true
 *              description: Unique identifier of the video to delete
 *              type: string
 *          responses:
 *              '200':
 *                  description: Video record deleted
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '404':
 *                  description: Video not found
 *              '422':
 *                  description: Missing fields
 *              '500':
 *                  description: Some kind of error
 */

exports.deleteVideo = (req, res, next)=>{
    const pathId = req.params.idVideo;
    if(!pathId){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    videoModel.findOne({_id: pathId}).exec()
        .then(result =>{
            if(result){
                return videoModel.deleteOne({_id: pathId}).exec()
                    .then(removeResult=>{
                        res.status(200).json({message:"Video record deleted"});
                    }).catch(err => {
                        res.status(500).json(err);
                    });
            }
            return res.status(404).json({message: "Video record not found"});
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};