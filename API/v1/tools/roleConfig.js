//This Js defines roles and all the respective permissions they have
module.exports = roles = [
    {
        name: "superadmin",
        description: "The one that ontrols all",
        resource : [
            {
                id : "admin",
                permissions: ["create", "read", "update", "delete"]
            },
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
            {
                id : "faq",
                permissions: ["create", "read", "update", "delete"]
            },
            {
                id : "requisition",
                permissions: ["create", "read", "update", "delete"]
            }
        ]
    },{
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
            {
                id : "faq",
                permissions: ["create", "read", "update", "delete"]
            },
            {
                id : "requisition",
                permissions: ["create", "read", "update", "delete"]
            }
        ]
    },
    {
        name: "client",
        description: "The main consumer of the app",
        resource : [
            {
                id : "manual",
                permissions: ["read"]
            },
            {
                id : "video",
                permissions: ["read"]
            },
            {
                id : "faq",
                permissions: ["read"]
            },
            {
                id : "requisition",
                permissions: ["create"]
            }
        ]
    }
];
