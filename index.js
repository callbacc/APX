const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const express = require("express");
const fs = require("fs");
const path = require('path');
const client = new Client();
client.queue = new Map();
client.vote = new Map();
["commands", "aliases"].forEach(x => client[x] = new Collection());
client.categories = fs.readdirSync("./commands/");
config({ path: __dirname + "/.env" });
["command", "event"].forEach(handler => { require(`./handlers/${handler}`)(client); });

const port = 3000;
const app = express();
app.get('/', (req, res) => {
    res.send(`Application listeting on port ${port}!`);
})

app.listen(port, () => {
    console.log(`Application listeting on port ${port}!`);
})

client.login(process.env.TOKEN);