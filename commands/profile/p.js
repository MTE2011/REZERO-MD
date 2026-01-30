const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'p',
    category: 'profile',
    description: 'View a Royal Card',
    aliases: ['profile'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const userData = client.db.getUser(target.id, target.username);

        if (!userData.info.registered) {
            if (target.id === message.author.id) {
                return message.reply('⚠️ Sorry, you don\'t have a Royal Card. Please register first using `.reg <age>`.');
            } else {
                return message.reply(`⚠️ ${target.username} does not have a Royal Card yet.`);
            }
        }

        const info = userData.info;
        const economy = userData.economy;

        // Box design with "USER PROFILE" at the top
        // Optimized to show essential info clearly
        const card = [
            `╔════════ USER PROFILE ════════╗`,
            `║ 👤 NAME: ${info.name.padEnd(20)} ║`,
            `║ 🎂 AGE: ${String(info.age).padEnd(21)} ║`,
            `║ 🎭 ROLE: ${info.role.padEnd(20)} ║`,
            `║ 💰 BAL: $${formatMoney(economy.wallet).padEnd(20)} ║`,
            `╚══════════════════════════════╝`
        ].join('\n');

        message.reply(`\`\`\`\n${card}\n\`\`\``);
    }
};
