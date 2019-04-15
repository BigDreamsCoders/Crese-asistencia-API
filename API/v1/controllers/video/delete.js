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
 *              require: true
 *              description: Unique identifier of the video to delete
 *              type: string
 *          responses:
 *              '200':
 *                  description: Video record deleted
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '404':
 *                  description: Video not found
 *              '500':
 *                  description: Some kind of error
 */

exports.deleteVideo = (req, res, next)=>{
    const pathId = req.params.idVideo;
    videoModel.find({_id: pathId}).exec()
        .then(result =>{
            if(result){
                videoModel.remove({_id: pathId}).exec()
                    .then(removeResult=>{
                        return res.status(200).json({message:"Video record deleted"});
                    }).catch(err => {
                        return res.status(500).json(err);
                    });
            }
            return res.status(404).json({message: "Video record not found"});
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};