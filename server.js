//const env = require("dotenv").config();
const http = require("http");
const app = require("./app");

//Sets the port for the API
const PORT = process.env.PORT || 5000;

//Set ups the server
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

module.exports = server;
