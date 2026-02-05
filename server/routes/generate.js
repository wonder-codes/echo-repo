const express = require('express');
const router = express.Router();
const { generateREADME } = require('../utils/openai');
const { fetchRepoContent } = require('../utils/github');
const Readme = require('../models/README');

router.post('/', async (req, res) => {
    const { code, repoUrl } = req.body;

    try {
        let contentToProcess = code;

        if (repoUrl && !code) {
            contentToProcess = await fetchRepoContent(repoUrl);
        }

        if (!contentToProcess) {
            return res.status(400).json({ error: 'No code or repository URL provided' });
        }

        const readmeContent = await generateREADME(contentToProcess);

        // Save to DB
        const newReadme = new Readme({
            title: repoUrl ? repoUrl.split('/').pop() : 'Generated README',
            content: readmeContent,
            code: contentToProcess,
            repoUrl: repoUrl || ''
        });
        await newReadme.save();

        res.json({ readme: readmeContent, id: newReadme._id });
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: 'Failed to generate README' });
    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await Readme.find().sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;
