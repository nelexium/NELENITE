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
    const gifs = ['https://media.discordapp.net/attachments/1078500556139659357/1089753933045575760/attachment.gif',
                'https://tenor.com/view/funny-cat-gif-26552422',
                'https://media.discordapp.net/attachments/741945274901200897/1038260219614068736/blinky.gif',
                'https://tenor.com/view/joel-spinning-fish-joel-pride-emote-gif-26200960',
                'https://tenor.com/view/cuh-what-cat-huh-gif-23986318',
                'https://tenor.com/view/cow-dancing-wtf-gif-5103663',
                'https://tenor.com/view/cow-spinning-cows-helicopter-cow-spinning-gif-26382626'];
    const index = Math.floor(Math.random() * gifs.length);
    if (msg.content.toLowerCase().includes('nele')) {
        msg.reply(gifs[index]);
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