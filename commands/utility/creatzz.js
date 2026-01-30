const { ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'creatzz',
    category: 'utility',
    description: 'Creates a cool server structure with 40 channels using different fonts',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command!');
        }

        const guild = message.guild;
        message.reply('🏗️ Starting server creation process with 40 cool channels... This will take a moment.');

        // Font mappings for "cool" look
        const fonts = {
            bold: (str) => str.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code + 119743);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code + 119737);
                return c;
            }).join(''),
            script: (str) => str.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code + 119951);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code + 119945);
                return c;
            }).join(''),
            mono: (str) => str.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code + 120363);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code + 120357);
                return c;
            }).join('')
        };

        try {
            const categories = [
                { 
                    name: `╭・${fonts.bold('INFORMATION')}`, 
                    channels: [
                        { name: `┃・📜-${fonts.mono('rules')}` },
                        { name: `┃・📢-${fonts.mono('announcements')}`, type: ChannelType.GuildAnnouncement },
                        { name: `┃・🔗-${fonts.mono('links')}` },
                        { name: `┃・🎭-${fonts.mono('roles')}` },
                        { name: `┃・👋-${fonts.mono('welcome')}` },
                        { name: `╰・✨-${fonts.mono('boosts')}` }
                    ] 
                },
                { 
                    name: `╭・${fonts.bold('COMMUNITY')}`, 
                    channels: [
                        { name: `┃・💬-${fonts.script('general')}` },
                        { name: `┃・📸-${fonts.script('media')}` },
                        { name: `┃・🎭-${fonts.script('memes')}` },
                        { name: `┃・🤖-${fonts.script('bot-usage')}` },
                        { name: `┃・💭-${fonts.script('quotes')}` },
                        { name: `┃・🎨-${fonts.script('art')}` },
                        { name: `╰・🎮-${fonts.script('gaming')}` }
                    ] 
                },
                { 
                    name: `╭・${fonts.bold('ECONOMY AREA')}`, 
                    channels: [
                        { name: `┃・🏦-${fonts.mono('bank')}` },
                        { name: `┃・🎰-${fonts.mono('gambling')}` },
                        { name: `┃・🎲-${fonts.mono('dice-rolls')}` },
                        { name: `┃・🃏-${fonts.mono('blackjack')}` },
                        { name: `┃・🏪-${fonts.mono('shop')}` },
                        { name: `┃・🏆-${fonts.mono('leaderboard')}` },
                        { name: `╰・💼-${fonts.mono('jobs')}` }
                    ] 
                },
                { 
                    name: `╭・${fonts.bold('VOICE CHANNELS')}`, 
                    channels: [
                        { name: `┃・🔊-${fonts.script('Lounge')}`, type: ChannelType.GuildVoice },
                        { name: `┃・🎮-${fonts.script('Gaming')}`, type: ChannelType.GuildVoice },
                        { name: `┃・🎵-${fonts.script('Music')}`, type: ChannelType.GuildVoice },
                        { name: `┃・💤-${fonts.script('AFK')}`, type: ChannelType.GuildVoice },
                        { name: `┃・🎙️-${fonts.script('Stage')}`, type: ChannelType.GuildStageVoice },
                        { name: `╰・🎧-${fonts.script('Private')}`, type: ChannelType.GuildVoice }
                    ] 
                },
                { 
                    name: `╭・${fonts.bold('SUPPORT')}`, 
                    channels: [
                        { name: `┃・🎫-${fonts.mono('tickets')}` },
                        { name: `┃・❓-${fonts.mono('help')}` },
                        { name: `┃・🛠️-${fonts.mono('bug-reports')}` },
                        { name: `╰・💡-${fonts.mono('suggestions')}` }
                    ] 
                },
                { 
                    name: `╭・${fonts.bold('STAFF ZONE')}`, 
                    private: true,
                    channels: [
                        { name: `┃・🛡️-${fonts.bold('admin-hq')}` },
                        { name: `┃・💬-${fonts.bold('staff-chat')}` },
                        { name: `┃・📝-${fonts.bold('mod-logs')}` },
                        { name: `┃・🔨-${fonts.bold('bans-appeals')}` },
                        { name: `┃・📢-${fonts.bold('staff-ann')}` },
                        { name: `┃・💾-${fonts.bold('database-logs')}` },
                        { name: `┃・📂-${fonts.bold('archives')}` },
                        { name: `┃・🔧-${fonts.bold('bot-config')}` },
                        { name: `┃・🧪-${fonts.bold('testing')}` },
                        { name: `╰・📈-${fonts.bold('analytics')}` }
                    ] 
                }
            ];

            // Total channels: 6 + 7 + 7 + 6 + 4 + 10 = 40
            
            for (const catData of categories) {
                const permissionOverwrites = [];
                if (catData.private) {
                    permissionOverwrites.push({
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    });
                }

                const category = await guild.channels.create({
                    name: catData.name,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: permissionOverwrites
                });

                for (const chan of catData.channels) {
                    await guild.channels.create({
                        name: chan.name,
                        type: chan.type || ChannelType.GuildText,
                        parent: category.id
                    });
                    // Small delay to avoid hitting rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            message.reply('✅ Cool server structure with 40 channels and decorative fonts created successfully! 🚀');
        } catch (error) {
            console.error(error);
            message.reply(`❌ Failed to create server structure: ${error.message}`);
        }
    }
};
