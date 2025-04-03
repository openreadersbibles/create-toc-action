const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    // Get the branch to process (default: gh-pages)
    const branch = core.getInput('branch') || 'gh-pages';

    // Checkout the gh-pages branch
    console.log(`Checking out branch: ${branch}`);
    execSync(`git fetch origin ${branch}`);
    execSync(`git checkout ${branch}`);

    // Get all directories in the current branch
    const directories = fs.readdirSync('.', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    directories.forEach(dir => {
        const dirPath = path.join('.', dir);
        const files = fs.readdirSync(dirPath);

        // Filter for .html and .pdf files
        const htmlAndPdfFiles = files.filter(file => file.endsWith('.html') || file.endsWith('.pdf'));

        if (htmlAndPdfFiles.length > 0) {
            // Create an index.html file
            const indexFilePath = path.join(dirPath, 'index.html');
            const indexContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Index of ${dir}</title>
</head>
<body>
    <h1>Index of ${dir}</h1>
    <ul>
        ${htmlAndPdfFiles.map(file => `<li><a href="${file}">${file}</a></li>`).join('\n')}
    </ul>
</body>
</html>
            `;

            fs.writeFileSync(indexFilePath, indexContent.trim());
            console.log(`Generated index.html for ${dir}`);
        }
    });

    // Commit and push changes
    console.log('Committing and pushing changes...');
    execSync('git config user.name "GitHub Actions"');
    execSync('git config user.email "actions@github.com"');
    execSync('git add .');
    execSync('git commit -m "Generate index.html files for gh-pages" || echo "No changes to commit"');
    execSync(`git push origin ${branch}`);

    core.setOutput('result', 'Index files generated successfully.');
} catch (error) {
    core.setFailed(error.message);
}