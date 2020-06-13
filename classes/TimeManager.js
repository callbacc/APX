const { MessageEmbed, Message } = require("discord.js");
const db = require("../managers/Connection.js");

class TimeManager {
    constructor(remind) {
        const con = db.connect();
        const [ rows ] = con.execute(`SELECT * FROM reminddata`);
        this.reason = rows[0].reason;
        this.user = rows[0].user;
        this.time = rows[0].time;
        const dateNow = Date.now();
        async function remintToUser(user, reason) {
            const remindUser = client.users.cache.find(`${this.user}`);
            let embed = new MessageEmbed()
                .setColor("#00FF00")
                .setAuthor("Arphenix")
                .setDescription(`I've reminded you: ${this.reason}`);
            remindUser.send(embed);
        }
        if(dateNow >= this.time) {
            remindToUser(this.user, this.reason);
        }
    }
}