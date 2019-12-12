const express = require  ("express");

const server = express();

const indexService = require("./src/services/")


server.use(express.json())
server.use("/students", indexService)




server.listen(3114, ()=>{
console.log("Hey I'm here on the port 3114")
})