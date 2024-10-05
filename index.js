const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const app = express();
const PORT = 3000;

const server = createServer(app);
let data = 'Initial Data';
const waitingClients = [];

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
})

app.get("/getData", (req, res) => {
    if(data !== req.query.lastData) {
        res.send({data});
    } else {
        waitingClients.push(res);
    }
})

app.get("/updateData", (req, res) => {
    data = req.query.data;
    while(waitingClients.length > 0) {
        const client = waitingClients.pop();    //when the new data comes in, all the clients that were waiting get notified with the fresh data
        client.json({data}); // in express is a method used to send a JSON response to the client
    }
   res.send({success:"Data updated Successfully"});
})

server.listen(PORT, () => {
    console.log(`Server for Long Polling started on PORT ${PORT}`);
})