const { exec } = require('child_process');
const path = require('path');

module.exports = {
    name: 'update',
    category: 'utility',
    description: 'Update the bot to the latest version from GitHub',
    async execute(message, args, client) {
        // Only owner can update
        const ownerId = process.env.OWNER_ID;
        if (message.author.id !== ownerId) {
            return message.reply('❌ Only the Bot Owner can use this command!');
        }
        
        message.reply('🔄 Updating bot from GitHub...');

        // Get the absolute path to the project root
        const projectRoot = path.resolve(__dirname, '../../');

        // Execute git pull inside the project root directory
        exec('git pull', { cwd: projectRoot }, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                // Check if it's a git repo issue
                if (error.message.includes('not a git repository')) {
                    return message.reply('❌ Error: This folder is not a Git repository. Please make sure the bot was cloned using `git clone`.');
                }
                return message.reply(`❌ Error during update: ${error.message}`);
            }
            
            const output = stdout || stderr || 'Already up to date.';
            
            const embed = {
                color: 0x00ff00,
                title: '✅ Update Successful',
                description: 'The bot has been updated to the latest version.',
                fields: [
                    { name: 'Output', value: `\`\`\`${output.slice(0, 1000)}\`\`\`` }
                ],
                timestamp: new Date()
            };

            message.reply({ embeds: [embed] });
            
            // Note: Bot might need a restart to apply code changes
            // If using PM2: exec('pm2 restart 0');
        });
    }
};
