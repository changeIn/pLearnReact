/* eslint-disable no-console */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const fs = require('fs');
const runner = require('happy-git-commit-message-checker').runner;

try {
    let message = fs.readFileSync('.git/COMMIT_EDITMSG', 'utf-8');
    const lines = message.split('\n');
    if (!lines[lines.length - 1]) {
        lines.pop();
    }
    message = lines.join('\n');
    runner(message);
} catch (e) {
    console.log('检测程序运行出错...', e);
}

