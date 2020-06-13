const db = require("../managers/Connection.js");
const { MessageEmbed } = require("discord.js");
const message = require("./message.js");
module.exports = async (client) => {
    try {
        await client.user.setPresence({ 
            activity: {
                name: 'for .help' 
            }, 
            status: 'watching' 
        })
        const con = await db.connect();
        console.log("Arphenix is now up and running.");
        setInterval(async function() {
            await con.execute(`UPDATE botlastonline SET botLastOnline = '${Date.now()}'`);
            const [ rows ] = await con.execute(`SELECT * FROM reminddata`);
            if(rows.length === 0) return;
            let time = rows[0].time;
            let reason = rows[0].reason;
            let user = rows[0].user;
            const actualUser = client.users.cache.get(`${user}`);
            if(time <= Date.now()) {
                if(rows.length > 0) {
                    let remindUser = new MessageEmbed()
                        .setColor("#00FF00")
                        .setAuthor("Arphenix")
                        .setTimestamp()
                        .setDescription(`Time's up: ${reason}`);
                    actualUser.send(remindUser);
                    await con.execute(`DELETE FROM reminddata WHERE user = ${user}`);
                }
            }
        }, 10000);
    } catch (error) {
        console.log(error);
    }
}