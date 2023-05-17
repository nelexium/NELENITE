const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const XIVAPI = require('@xivapi/js');
const xiv = new XIVAPI({
    private_key: process.env.XIV_TOKEN,
    language: 'en',
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xivsearchlist')
        .setDescription('Returns the list of abilities provided.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The name of the ability to search:')
                .setRequired(true)),

    async execute(interaction) {
        xiv.search(interaction.options.getString('query'), { indexes: ['Action'] }).then(response => {
            const results = response.Results;
            const count = response.Pagination.ResultsTotal;
            const res_map_name = results.map(r => r.Name);
            const res_map_id = results.map(r => r.ID);

            let str = '```';

            for (let i = 0; i < count; i++) {
                str += `No. ${i + 1}, ID: ${res_map_id[i]}, Name: ${res_map_name[i]};\n`;
            }

            str += '```';

            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle(`Returning ${count} abilities named ${interaction.options.getString('query')}`)
                .addFields({ name: 'Results:', value: `${str}` })
                .setFooter({ text: `xivapi.com | Response time: ${response.SpeedMs}ms` });

            interaction.reply({ embeds: [embed] });
            return;
        });
    },
};