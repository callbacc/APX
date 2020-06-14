const db = require("./managers/Connection.js");
const { Message } = require("discord.js");

module.exports = {
    getGuildLanguage: async function(guildid) {
        const con = await db.connect();
        const [ rows ] = await con.execute(`SELECT * FROM guildsettings WHERE id = '${guildid}'`);
        var language = "";
        if(rows.length === 0) {
            language = "english";
        } else if(rows[0].language === "english") {
            language = "english";
        } else {
            language = "romanian";
        }
        return language;
    },
    setGuildLanguage: async function(guildid, language) {
        const con = await db.connect();
        await con.execute(`UPDATE guildsettings SET language = '${language}' WHERE id = '${guildid}'`);
    }
}