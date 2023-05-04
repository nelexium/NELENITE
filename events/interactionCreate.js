const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command named ${interaction.commandName} exists.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(err);
        }
    },
};