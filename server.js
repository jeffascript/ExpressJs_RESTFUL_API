const express = require  ("express");

const server = express();

const indexService = require("./src/services/")

const cors = require("cors")

server.use(express.json());
server.use("/students", indexService);
server.use(cors());




server.listen(3114, ()=>{
console.log("Hey I'm here on the port 3114")
})