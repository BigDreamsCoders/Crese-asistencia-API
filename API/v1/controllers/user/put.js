const userModel = require("../../models/user");
const regexInput = /(^disabled$)|(^enabled$)/;
const regexFields = /(^notifications$)|(^sounds$)|(^darkMode$)/
const numberSettings = 3;
/**
 * @swagger
 * paths:
 *  /user/settings:
 *      put:
 *          tags:
 *          - user
 *          summary: Changes the configurations of personal settings
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: settings
 *              required: true
 *              in: body
 *              description: An array of objects that contains the fields and values to be assigned
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      change:
 *                          type: string
 *                          description: what field is going to be modfied
 *                          example: notifications
 *                      value:
 *                          type: string
 *                          description: if it's going to be disabled or enabled
 *                          example: disabled
 *          responses:
 *              '200':
 *                  description: Settings modified
 *              '401':
 *                  description: Not verified user, please login and add the token
 *              '500':
 *                  description: Some kind of error
 */

exports.patchSettings = (req,res,next)=>{
    const settingsChange= {};
    let = size = 0;
    const idUser = req.userData.idUser;
    if(!req.body.settings){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    for(const option of req.body.settings){
        //Change: notifications - Value: disabled
        if(!option.change.match(regexFields)){
            return res.status(500).json({
                message: "You are only allowed to change notifications, sounds and dark mode"
            });
        }
        if(!option.value.match(regexInput)){
            return res.status(500).json({
                message: "Only strings available should be 'enabled' or 'disabled'"
            });
        }
        settingsChange[option.change] = option.value;
        size++;
    }
    if(size> numberSettings){
        return res.status(500).json({
            message: "Exceding the maximum number of settings, check your input"
        });
    }
    userModel.updateOne({_id: idUser}, { $set : {settings: settingsChange}})
        .exec()
        .then(result => {
            res.status(200).json({message: "Settings modified"});
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

const faqModel = require("../../models/faq");

/**
 * @swagger
 * paths:
 *  /user/{idUser}:
 *      put:
 *          tags:
 *          - user
 *          summary: Updates fields of a specific document of a User
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: idUser
 *              in: path
 *              required: true
 *              description: Unique identifier of the User to update
 *              type: string
 *            - required: true
 *              name: updateContent
 *              in: body
 *              description: An array of objects that contains the fields and values to be assigned
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      change:
 *                          type: string
 *                          description: what field is going to be modfied
 *                          example: answer
 *                      value:
 *                          type: string
 *                          description: if it's going to be disabled or enabled
 *                          example: We are located in San Miguel
 *          responses:
 *              '200':
 *                  description: User updated
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '500':
 *                  description: Some kind of error
 */

exports.patchUser = (req,res,next)=>{
    const idUser = req.params.idUser;
    const fieldsToChange= {};
    console.log(req.body.updateContent);
    for(const option of req.body.updateContent){
        fieldsToChange[option.change] = option.value;
    }
    userModel.updateOne({_id: idUser}, { $set : fieldsToChange })
        .exec()
        .then(resultado => {
            console.log(resultado);
            res.status(200).json({message: "User updated"});
        })
        .catch(err => {
            res.status(500).json(err);
        });
};