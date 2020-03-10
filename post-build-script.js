/*
 * Quasar does not have option to produce output to custom folder.
 * In order to publish to github pages, we need docs directory.
 */

const fs = require('fs');

const currPath = './dist/spa';
const newPath = './dist/docs';

try {
    fs.renameSync(currPath, newPath);
    console.log(`Successfully renamed "${currPath}" to "${newPath}"`);
} catch (err) {
    console.log(err);
}
