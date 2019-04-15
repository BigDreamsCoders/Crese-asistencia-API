//This Js defines roles and all the respective permissions they have
module.exports = roles = [{
    name: "admin",
    description: "The one that ontrols all",
    resource : [
        {
            id : "user",
            permissions: ["create", "read", "update", "delete"]
        },
        {
            id : "manual",
            permissions: ["create", "read", "update", "delete"]
        },
        {
            id : "video",
            permissions: ["create", "read", "update", "delete"]
        },
    ]
},
{
    name: "client",
    description: "The main consumer of the app",
    resource : [
        {
            id : "user",
            permissions: ["read"]
        },
        {
            id : "manual",
            permissions: ["read"]
        },
        {
            id : "video",
            permissions: ["read"]
        },
    ]
}];