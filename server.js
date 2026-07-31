// server.js
const express = require('express');
const { generate } = require('youtube-po-token-generator');

const app = express();
const port = process.env.PORT || 3000;

let cachedPoToken = null;
let cacheTime = 0;
const CACHE_DURATION = 3600000; // 1時間

app.use(express.json());

app.get('/api/generate-pot', async (req, res) => {
    const now = Date.now();

    if (cachedPoToken && (now - cacheTime) < CACHE_DURATION) {
        return res.json({
            success: true,
            poToken: cachedPoToken.poToken,
            visitorData: cachedPoToken.visitorData,
            cached: true,
        });
    }

    try {
        console.log('🔄 Generating new PoToken...');
        const result = await generate();
        cachedPoToken = result;
        cacheTime = now;
        res.json({
            success: true,
            poToken: result.poToken,
            visitorData: result.visitorData,
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        // フォールバック：古いキャッシュがあれば返す
        if (cachedPoToken) {
            return res.json({
                success: true,
                poToken: cachedPoToken.poToken,
                visitorData: cachedPoToken.visitorData,
                cached: true,
                error: error.message,
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});
