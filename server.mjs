// server.mjs（ES Module版）
import express from 'express';
import { generate } from 'youtube-po-token-generator';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/generate-pot', async (req, res) => {
    try {
        const result = await generate();
        res.json({
            success: true,
            poToken: result.poToken,
            visitorData: result.visitorData,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('PoToken generation failed:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});
