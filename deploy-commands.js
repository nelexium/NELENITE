const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const path = require('path');


const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log(foldersPath);

// grabbing all command files
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARN] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// initialize REST module
const rest = new REST().setToken(process.env.TOKEN);

// deploying commands
(async () => {
    try {
        console.log(`[REST] Refreshing ${commands.length} slash commands.`);

        const data = await rest.put(
            // test environment (Misc Guild)
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`[REST] Successfully reloaded ${data.length} slash commands.`);
    } catch (err) {
        console.error(err);
    }
})();