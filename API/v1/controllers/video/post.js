const videoModel = require("../../models/video");

/**
 * @swagger
 * paths:
 *  /video:
 *      post:
 *          tags:
 *          - video
 *          summary: Creates a video in the database
 *          produces:
 *          - "application/json"
 *          parameters:
 *              -   in: header
 *                  name: Authorization
 *                  description: Authorization token format must be the following 'Bearer **********'
 *                  required: true
 *                  type: string
 *              -   in: body
 *                  name: Video Structure
 *                  description: Information of the video to be inserted in the database
 *                  required: true
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: "The name of the video"
 *                              example: "Samsung Earphone Repair"
 *                          URL:
 *                              type: string
 *                              description: "The reference of the video"
 *                              example: "https://www.youtube.com/watch?v=zw7OePH-d6k"
 *                          sourceType:
 *                              type: string
 *                              description: "Description of the type of video"
 *                              example: "Created by lonator"
 *                          dateCreated:
 *                              type: string
 *                              description: "When it was added"
 *                              example: "2018-8-3 11:12:40"
 *                          keywords:
 *                              type: array
 *                              description: "Text strings that help to find a record"
 *                              items:
 *                                  type: string
 *                                  example: "Iphone"
 *                          category:
 *                              type: string
 *                              description: "Which of the four categories the video belongs"
 *                              example:
 *                              - "cámara wifi"
 *                              - "cctv"
 *                              - "gps"
 *                              - "control de acceso"
 *          responses:
 *                  '201':
 *                      description: Video record added
 *                  '401':
 *                      description: Your lack of permissions prevents you from accessing this route
 *                  '422':
 *                      description: Video couldn't be created
 *                  '500':
 *                      description: Some kind of error
 */

exports.insertVideo= (req, res, next) => {
    if(!req.body.name || !req.body.URL || !req.body.sourceType ||
        !req.body.dateCreated || !req.body.keywords || !req.body.category){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const videoBody = {
        name : req.body.name,
        URL: req.body.URL,
        sourceType : req.body.sourceType,
        keywords : req.body.keywords,
        category: req.body.category,
        creator: req.userData.idUser
    };
    const newVideo = new videoModel(videoBody);
    newVideo.save()
        .then((result) =>{
            return res.status(201).json({
                userData: newVideo,
                message: "Video record created"
            })
        }).catch(err =>{
            return res.status(500).json({
                message: err.message
            });
        });
};
