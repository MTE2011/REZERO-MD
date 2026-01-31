const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

function startDatabaseAPI(db) {
    const app = express();
    const port = process.env.API_PORT || 3000;
    const apiKey = process.env.DATABASE_KEY || 'mudaubotsconnet';

    app.use(bodyParser.json());

    // Middleware to check API Key
    const authenticate = (req, res, next) => {
        const key = req.headers['x-api-key'];
        if (key !== apiKey) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    };

    // Get User Data
    app.get('/user/:id', authenticate, async (req, res) => {
        try {
            const user = await db.getUser(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Update Balance
    app.post('/user/:id/balance', authenticate, async (req, res) => {
        try {
            const { amount, type } = req.body;
            const newBalance = await db.addMoney(req.params.id, amount, type || 'wallet');
            res.json({ success: true, balance: newBalance });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Add XP
    app.post('/user/:id/xp', authenticate, async (req, res) => {
        try {
            const { amount } = req.body;
            const user = await db.getUser(req.params.id);
            user.economy.xp = (user.economy.xp || 0) + amount;
            user._raw.xp = (user._raw.xp || 0) + amount;
            await db.saveUser(req.params.id);
            res.json({ success: true, xp: user.economy.xp });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.listen(port, () => {
        console.log(`Database API running on port ${port}`);
    });
}

module.exports = startDatabaseAPI;
