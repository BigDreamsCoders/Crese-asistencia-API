const roleConfig = require("../tools/roleConfig");

//Create a functions that returns a middleware
/**
 * @param {string} allowed - action being made
 * @param {string} model - in which data model the action is being made
 */

module.exports = (allowed, model)=>{
    const isAllowed = allowed;
    const isModel = model;
    //Return a middleware for the route
    return(req, res, next)=>{
        try{
            //Searchs roleConfig in order to find in which role is the user
            const foundRole = roleConfig.find((element)=>{
                //If is found its returns
                if(element.name==req.userData.roles){
                    return element;
                }
            });
            //Enter if the user role was found
            if(foundRole){
                //Similar to the first it searchs for the resource involved in the controller
                const foundModel = foundRole.resource.find((element)=>{
                    if(element.id==isModel){
                        return element;
                    }
                });
                //Enter if the resource is specified in the role
                if(foundModel){
                    //Searchs for the permissions granted to the user in the data model
                    const foundAllow = foundModel.permissions.find((element)=>{
                        if(element==isAllowed){
                            return element;
                        }
                    });
                    //If the permissions is found then continue the execution of the route
                    if(foundAllow){
                        return next();
                    }
                }
            }
            return res.status(401).json({
                message: "Your lack of permissions prevents you from accessing this route"
            });
        }
        catch(error){
            return res.status(401).json({
                message: "Unexpected error while trying to find the permissions"
            });
        }
    }
}

