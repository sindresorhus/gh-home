#!/usr/bin/env node
'use strict';
const meow = require('meow');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const gitRemoteUpstreamUrl = require('git-remote-upstream-url');
const githubUrlFromGit = require('github-url-from-git');
const opn = require('opn');

meow(`
	Usage
	  $ gh-home
`);

function open(url) {
	opn(githubUrlFromGit(url), {wait: false});
}

gitRemoteUpstreamUrl()
	.then(open)
	.catch(() => gitRemoteOriginUrl())
	.then(open)
	.catch(() => {
		console.error(`Couldn't find the remote origin or upstream. Ensure it's set and you're in a repo.\n\n  $ git remote add origin https://github.com/user/repo.git`);
		process.exit(1);
	});
