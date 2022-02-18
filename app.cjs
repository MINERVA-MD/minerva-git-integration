// This app.cjs file is the entry point for the simple-git playground.
const simpleGit = require('simple-git');
const XMLHttpRequest = require('xhr2');
// Must require dotenv (.env) to use protected variables.
require('dotenv').config();

simpleGit().clean(simpleGit.CleanOptions.FORCE);

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const TOKEN = process.env.TOKEN;
const REPO = process.env.REPO;
const remote = `https://${ TOKEN }@github.com/${ USERNAME }/${ REPO }.git`;

// String representing working directory for git commands to run in -> SimpleGitOptions object or undefined
const options = () => Partial<SimpleGitOptions> {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
};

// Setting all options in a single object,
const git = () => SimpleGit = simpleGit(options);

// This function clones a git repository.
async function cloneRepo() {
    await simpleGit()
        .clone(remote)
        .then(() => console.log('Repository has been cloned. 💖'))
        .catch((err) => console.error('Repository has failed to clone. 😢 : ', err))
}

function addToRepo() {
    cloneRepo()
        .then(() => {
            process.chdir(`./${REPO}`)
            simpleGit()
            .add('*.md')
            .commit("Testing commit from addToRepo function.")
            .push(['origin', 'main'], () => console.log('Push successful. 💝'))
            .then(() => console.log('Commit successful. 💝'))
            .catch((err) => console.error('Commit failed. 😭: ', err))
        })
        .catch((err) => {
            console.log('Cloning failed. 😭: ', err);
        })
}

// This function will get and console.log all current repositories in the user's account.
function requestUserRepos(USER){
    // Create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
        
    // GitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${USER}/repos`;

    // Open a new connection, using a GET request via URL endpoint
    // Providing 3 arguments (GET/POST, The URL, Async True/False)
    xhr.open('GET', url, true);

    // When request is received
    // Process it here
    xhr.onload = function() {

        // Parse API data into JSON
        const data = JSON.parse(this.response);
        
        // Log the response
        console.log(data);

        for (let i in data) {
            
            // Log the repo name
            console.log('Repo:', data[i].name);
            
            // Log the repo description
            console.log('Description:', data[i].description);
            
            // Log the repo url
            console.log('URL:', data[i].html_url);
            
            // Add a separator between each repo
            console.log('=========================')
        }
    }

    // Send the request to the server
    xhr.send();
}

// cloneRepo();
addToRepo();


