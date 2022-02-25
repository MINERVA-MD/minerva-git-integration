/** 
 * This application is used to authenticate a user's GitHub account via their personal token while allow users to clone & push to an existing repository.
 */
const simpleGit = require('simple-git');
const XMLHttpRequest = require('xhr2');

// The .env is used only for development purposes and should be removed when deployed.
require('dotenv').config();

simpleGit().clean(simpleGit.CleanOptions.FORCE);

const username = process.env.USERNAME;
const token = process.env.TOKEN;
const repo = process.env.REPO;

// Boolean to store whether or not the user has already been authenticated.
let isAuthenticated = false;

/**
 * This function authenticates the user by sending an HTTP GET request to GitHub through an authorization header.
 * @param username Accepts a username as a string from the user's input.
 * @param token Accepts a token as a string from the user's input.
 */
function authenticate(username, token) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/user`;

    xhr.open('GET', url);

    xhr.setRequestHeader("authorization", `token ${token}`);

    xhr.onload = function() {
        // Parse API data into JSON
        const data = JSON.parse(this.response);
        checkAuthenticateResponse(data)
    }
    xhr.send();
}

/**
 * This function checks if there is an existing data.message value. If data.message = null then sets the isAuthenticated boolean to true;
 * @param data Accepts a parsed JSON data object representation authentication data.
 */
function checkAuthenticateResponse(data) {
    if(data.message != null) {
        console.log('Failed to authenticate user. 😭');
    }
    else {
        isAuthenticated = true;
        console.log('Successfully authenticated user. 😊');
    }
}

/**
 * This function allows a user to clone a repository by providing a username, token, and repo variables. The repository will be cloned in the root folder.
 * @param username Accepts a username as a string.
 * @param token Accepts a token as a string.
 * @param repo Accepts a repository name as a string.
 */
async function cloneRepo(username, token, repo) {
    const remote = `https://${ token }@github.com/${ username }/${ repo }.git`;
    await simpleGit()
        .clone(remote)
        .then(() => console.log('Repository has been cloned. 💖'))
        .catch((err) => console.error('Repository has failed to clone. 😢 : ', err))
}

/**
 * This function allows a user to add a file to an existing repository..
 * @param filename Accepts a filename as a string.
 * @param repo Accepts a repository name as a string.
 */
function addFileToRepo(repo, filename) {
    cloneRepo()
        .then(() => {
            process.chdir(`./${repo}`)
            simpleGit()
            .add(`${filename}.md`)
            .commit("Testing commit from addToRepo function.")
            .push(['origin', 'main'], () => console.log('Push successful. 💝'))
            .then(() => console.log('Commit successful. 💝'))
            .catch((err) => console.error('Commit failed. 😭: ', err))
        })
        .catch((err) => {
            console.log('Cloning failed. 😭: ', err);
        })
}

/**
 * This function retrieves all the repositories from a user via their username and returns an array of repos.
 * @param username Accepts a username as a string.
 */
function allUserRepos(username){
    let repos = [];
    // Create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
        
    // GitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${username}/repos`;

    // Open a new connection, using a GET request via URL endpoint
    // Providing 3 arguments (GET/POST, The URL, Async True/False)
    xhr.open('GET', url, true);

    // When request is received
    // Process it here
    xhr.onload = function() {

        // Parse API data into JSON
        const data = JSON.parse(this.response);

        for (let i in data) {
            repos.push({repo: data[i].name, description: data[i].description})
        }
        return repos;
    }

    // Send the request to the server
    xhr.send();
}