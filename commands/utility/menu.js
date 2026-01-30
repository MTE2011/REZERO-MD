module.exports = {
    name: 'menu',
    category: 'utility',
    description: 'Show all commands',
    aliases: ['help', 'commands', 'cmds'],
    async execute(message, args, client) {
        const prefix = process.env.PREFIX || '!';
        
        // Group commands by category
        const categories = {};
        
        // We use a Set to avoid duplicate commands due to aliases
        const uniqueCommands = new Set(client.commands.values());
        
        uniqueCommands.forEach(cmd => {
            const category = cmd.category || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(cmd.name);
        });

        const embed = {
            color: 0x00aaff,
            title: '🤖 REZERO-MD BOT MENU',
            description: `Use \`${prefix}menu <command>\` for more details on a specific command.`,
            fields: [],
            footer: {
                text: `REZERO-MD | Total Commands: ${uniqueCommands.size}`,
                icon_url: client.user ? client.user.displayAvatarURL() : null
            },
            timestamp: new Date()
        };

        // Add fields for each category
        for (const [category, commands] of Object.entries(categories)) {
            embed.fields.push({
                name: `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                value: commands.map(cmd => `\`${prefix}${cmd}\``).join(', '),
                inline: false
            });
        }

        // If a specific command is requested
        if (args[0]) {
            const name = args[0].toLowerCase();
            const command = client.commands.get(name);

            if (command) {
                const cmdEmbed = {
                    color: 0x00aaff,
                    title: `Command: ${command.name}`,
                    description: command.description || 'No description available.',
                    fields: [
                        { name: 'Category', value: command.category || 'None', inline: true },
                        { name: 'Aliases', value: command.aliases ? command.aliases.join(', ') : 'None', inline: true }
                    ],
                    footer: { text: `REZERO-MD` },
                    timestamp: new Date()
                };
                return message.reply({ embeds: [cmdEmbed] });
            }
        }

        message.reply({ embeds: [embed] });
    }
};
