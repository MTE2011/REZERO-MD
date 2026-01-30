const { ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'creatzz',
    category: 'utility',
    description: 'Creates a full server structure with cool channels and categories',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command!');
        }

        const guild = message.guild;
        message.reply('🏗️ Starting server creation process... This may take a moment.');

        try {
            // 1. Create Categories
            const categories = [
                { name: '━━━ INFO ━━━', channels: ['welcome', 'rules', 'announcements', 'roles'] },
                { name: '━━━ GENERAL ━━━', channels: ['chat', 'media', 'bot-commands', 'memes'] },
                { name: '━━━ ECONOMY ━━━', channels: ['work-area', 'gambling', 'shop-talk', 'bank'] },
                { name: '━━━ VOICE ━━━', channels: ['General VC', 'Gaming', 'Music', 'AFK'], type: ChannelType.GuildVoice }
            ];

            for (const catData of categories) {
                const category = await guild.channels.create({
                    name: catData.name,
                    type: ChannelType.GuildCategory
                });

                for (const chanName of catData.channels) {
                    await guild.channels.create({
                        name: chanName,
                        type: catData.type || ChannelType.GuildText,
                        parent: category.id
                    });
                }
            }

            message.reply('✅ Server structure created successfully! 🚀');
        } catch (error) {
            console.error(error);
            message.reply(`❌ Failed to create server structure: ${error.message}`);
        }
    }
};
