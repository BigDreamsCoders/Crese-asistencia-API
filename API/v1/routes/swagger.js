const express = require("express");
const router = express.Router();
const swaggerJSDoc = require("swagger-jsdoc");

// General definition of a Swagger document
const swaggerDefinition = {
    info: {
        title: "Crese-asistencia API",
        version: "1.0.0",
        description: "API diseñado con el fin de administrar una plataforma capaz de servir manuales y videos de marcas muy en específicas. También maneja un sistema de preguntas y autentificación de usuarios.",
    },
    host: "https://crese-asistencia.herokuapp.com",
    basePath: "/API/v1",
    schemes: ["https" , "http"],
    securityDefinitions:{
        Authorization: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
        }
    }
};
// Options for Swagger
const options = {
    // Imports the swaggerDefinition ^
    swaggerDefinition: swaggerDefinition,
    // Which places will it read
    apis: ["./API/v1/controllers/**/*.js","./API/v1/models/*.js", "./API/v1/routes/*.js"],// pass all in array
};
// Initialize the Swagger document
const swaggerSpec = swaggerJSDoc(options);

// This route returns a json that the index.html of Swagger reads
router.get("/json", (req, res, next)=> {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(swaggerSpec);
});

module.exports = router;