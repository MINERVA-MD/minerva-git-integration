const fs = require('fs')


async function createMd(path, filename, content) {
    await fs.writeFileSync(`${filename}.md`, content, (err) => {
        if (err) {
            console.error(`Your ${filename}.md file could not be created. 🤕`);
            return;
        }
        console.log(`Your ${filename}.md file has been created. 😊`);
    })
}

async function readMd(path, filename) {
    await fs.readFile(`${filename}.md`, (err, data) => {
        if (err) {
            console.error(`Your ${filename}.md file could not be read. 👎🏻`)
        }
        console.log(`Your ${filename}.md has been returned. 😊`);
        return data;
    })
}

createMd('repo', 'test', 'test');
readMd('repo', 'test');;