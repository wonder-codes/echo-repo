const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateREADME = async (code) => {
    const prompt = `
Generate a professional, structured Markdown README for the following code.
The README must include:
1. Project Title
2. Description (what the project does)
3. Installation (how to set it up)
4. Usage (how to run or use it)
5. API Reference (if applicable)
6. Contributing guidelines

Code:
\`\`\`
${code}
\`\`\`

Ensure the output is ONLY the Markdown content.
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert technical writer and developer." },
            { role: "user", content: prompt }
        ],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
};

module.exports = { generateREADME };
