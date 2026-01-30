const { exec } = require('child_process');

module.exports = {
    name: 'update',
    category: 'utility',
    description: 'Update the bot to the latest version from GitHub',
    async execute(message, args, client) {
        // Check if user has permission (e.g., owner only)
        // For now, we'll assume the user wants it accessible or has other checks
        
        message.reply('🔄 Updating bot from GitHub...');

        exec('git pull', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return message.reply(`❌ Error during update: ${error.message}`);
            }
            
            const embed = {
                color: 0x00ff00,
                title: '✅ Update Successful',
                description: 'The bot has been updated to the latest version.',
                fields: [
                    { name: 'Output', value: `\`\`\`${stdout || 'No output'}\`\`\`` }
                ],
                timestamp: new Date()
            };

            message.reply({ embeds: [embed] });
            
            // Optionally restart the process if using a process manager like pm2
            // exec('pm2 restart all');
        });
    }
};
