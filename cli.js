#!/usr/bin/env node
'use strict';
const meow = require('meow');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const gitRemoteUpstreamUrl = require('git-remote-upstream-url');
const githubUrlFromGit = require('github-url-from-git');
const opn = require('opn');
const execa = require('execa');

const cli = meow(`
	Usage
	  $ gh-home [repo | user/repo]

	Examples
	  $ gh-home
	  $ gh-home myrepo
	  $ gh-home avajs/ava
`);

function open(url) {
	opn(githubUrlFromGit(url), {wait: false});
}

const input = cli.input[0];

if (input) {
	if (input.includes('/')) {
		opn(`https://github.com/${input}`, {wait: false});
	} else {
		const user = execa.sync('git', ['config', '--global', 'github.user']).stdout;
		opn(`https://github.com/${user}/${input}`, {wait: false});
	}
} else {
	gitRemoteUpstreamUrl()
		.then(open)
		.catch(() => gitRemoteOriginUrl())
		.then(open)
		.catch(() => {
			console.error(`Couldn't find the remote origin or upstream. Ensure it's set and you're in a repo.\n\n  $ git remote add origin https://github.com/user/repo.git`);
			process.exit(1);
		});
}
