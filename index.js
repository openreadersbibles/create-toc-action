const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token = core.getInput('github-token'); // Pass a GitHub token as input
console.log('Token:', token); // Log the token for debugging (remove in production)
const octokit = github.getOctokit(token);

async function listDirectory(owner, repo, path, branch) {
    console.log("Here are the parameters:");
    console.log(owner, repo, path, branch);
    const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch, // Branch name
    });

    if (Array.isArray(response.data)) {
        return response.data.map(item => item.name); // List of file and directory names
    } else {
        throw new Error('The specified path is not a directory.');
    }
}

// Wrap the main logic in an async function
async function run() {
    try {
        const owner = github.context.repo.owner;
        const repo = github.context.repo.repo;
        const path = ''; // Root directory
        const branch = core.getInput('branch') || 'gh-pages';

        const files = await listDirectory(owner, repo, path, branch);
        console.log('Directory listing:', files);

        // Additional logic for processing files can go here
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the async function
run();

/*
try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const path = ''; // Root directory
    const branch = core.getInput('branch') || 'gh-pages';

    const files = await listDirectory(owner, repo, path, branch);
    console.log('Directory listing:', files);

    //     // Get all directories in the current branch
    //     const directories = fs.readdirSync('.', { withFileTypes: true })
    //         .filter(dirent => dirent.isDirectory())
    //         .map(dirent => dirent.name);

    //     directories.forEach(dir => {
    //         const dirPath = path.join('.', dir);
    //         const files = fs.readdirSync(dirPath);

    //         // Filter for .html and .pdf files
    //         const htmlAndPdfFiles = files.filter(file => file.endsWith('.html') || file.endsWith('.pdf'));

    //         if (htmlAndPdfFiles.length > 0) {
    //             // Create an index.html file
    //             const indexFilePath = path.join(dirPath, 'index.html');
    //             const indexContent = `
    // <!DOCTYPE html>
    // <html>
    // <head>
    //     <title>Index of ${dir}</title>
    // </head>
    // <body>
    //     <h1>Index of ${dir}</h1>
    //     <ul>
    //         ${htmlAndPdfFiles.map(file => `<li><a href="${file}">${file}</a></li>`).join('\n')}
    //     </ul>
    // </body>
    // </html>
    //             `;

    //             fs.writeFileSync(indexFilePath, indexContent.trim());
    //             console.log(`Generated index.html for ${dir}`);
    //         }
    //     });

    //     // Commit and push changes
    //     console.log('Committing and pushing changes...');
    //     execSync('git config user.name "GitHub Actions"');
    //     execSync('git config user.email "actions@github.com"');
    //     execSync('git add .');
    //     execSync('git commit -m "Generate index.html files for gh-pages" || echo "No changes to commit"');
    //     execSync(`git push origin ${branch}`);

    core.setOutput('result', 'Index files generated successfully.');
} catch (error) {
    core.setFailed(error.message);
}
*/