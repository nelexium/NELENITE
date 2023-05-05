// init
const { Collection, Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');

// creating the client and it's intents
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent] });

// ignore this
client.on('messageCreate', (msg) => {
    if (msg.content.toLowerCase().includes('nele')) {
        msg.reply('https://tenor.com/bslkl.gif');
    }
});

// command hander
client.commands = new Collection();

const fldPath = path.join(__dirname, 'commands');
const cmdFolders = fs.readdirSync(fldPath);

for (const folder of cmdFolders) {
    const cmdPath = path.join(fldPath, folder);
    const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
    for (const file of cmdFiles) {
        const filePath = path.join(cmdPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARN] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// event handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);