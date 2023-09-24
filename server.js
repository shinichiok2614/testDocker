const ronin = require("ronin-server");
const mocks = require("ronin-mocks");
const server = ronin.server();

server.use("/", mocks.server(server.Router(), false, true));
const PORT = 8000;
console.log("server is listening on", PORT);
server.start();
console.log(`${process.env}`);
