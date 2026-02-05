const { Octokit } = require('octokit');
require('dotenv').config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const fetchRepoContent = async (repoUrl) => {
    try {
        // repoUrl format: https://github.com/owner/repo
        const urlParts = repoUrl.replace('https://github.com/', '').split('/');
        if (urlParts.length < 2) throw new Error('Invalid GitHub URL');

        const owner = urlParts[0];
        const repo = urlParts[1];

        const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: '',
        });

        // For simplicity, we'll fetch the content of key files or a summary
        // In a real RAG app, we'd crawl all files. Here we'll take top-level files.
        let fullContent = '';
        for (const file of data) {
            if (file.type === 'file' && (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.py') || file.name.endsWith('.json'))) {
                const { data: fileData } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: file.path,
                });

                const content = Buffer.from(fileData.content, 'base64').toString();
                fullContent += `\n--- File: ${file.path} ---\n${content}\n`;
            }
        }

        return fullContent || 'No relevant code files found.';
    } catch (error) {
        console.error('Error fetching GitHub repo:', error);
        throw error;
    }
};

module.exports = { fetchRepoContent };
