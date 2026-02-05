const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
    const { message, code, history } = req.body;

    try {
        const systemPrompt = `
You are an expert developer assistant. Use the following code context to answer the user's question accurately.
If the answer isn't in the code, use your general knowledge but clarify it's based on general patterns.

Code Context:
\`\`\`
${code}
\`\`\`
`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0,
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

module.exports = router;
