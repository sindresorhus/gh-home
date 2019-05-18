#!/usr/bin/env node
'use strict';
const meow = require('meow');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const gitRemoteUpstreamUrl = require('git-remote-upstream-url');
const githubUrlFromGit = require('github-url-from-git');
const open = require('open');
const execa = require('execa');

const cli = meow(`
	Usage
	  $ gh-home [repo | user/repo]

	Examples
	  $ gh-home
	  $ gh-home myrepo
	  $ gh-home avajs/ava
`);

const repo = cli.input[0];

(async () => {
	if (repo) {
		if (repo.includes('/')) {
			await open(`https://github.com/${repo}`);
		} else {
			const { stdout: user } = await execa('git', ['config', '--global', 'github.user']);
			await open(`https://github.com/${user}/${repo}`);
		}
	} else {
		let url;
		try {
			try {
				url = await gitRemoteUpstreamUrl();
			} catch (_) {
				url = await gitRemoteOriginUrl();
			}

			url = githubUrlFromGit(url);
		} catch (_) {
			console.error('Couldn\'t find the remote origin or upstream. Ensure it\'s set and you\'re in a repo.\n\n  $ git remote add origin https://github.com/user/repo.git');
			process.exit(1);
		}

		if (!url) {
			console.error('Couldn\'t find the repo\'s GITHUB URL. Ensure you are inside a github repo.');
			process.exit(1);
		}

		await open(url);		
	}
})();
