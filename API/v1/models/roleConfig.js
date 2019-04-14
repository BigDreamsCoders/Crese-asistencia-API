//This Js defines roles and all the respective permissions they have
module.exports = roles.admin = {
    name: "Admin",
    description: "The one that ontrols all",
    resource : [
        {
            id : "user",
            permissions: ["create", "read", "update", "delete"]
        },
    ]
};
module.exports = roles.client = {
    name: "Client",
    description: "The main consumer of the app",
    resource : [
        {
            id : "user",
            permissions: ["read"]
        },
    ]
};