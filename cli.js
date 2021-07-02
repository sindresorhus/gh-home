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

	Options
	  --prs -p	   Open the pull requests of a GitHub repo
	  --issues -i  Open the issues of a GitHub repo
	
	Examples
	  $ gh-home
	  $ gh-home myrepo
	  $ gh-home avajs/ava
	  $ gh-home --issues
	  $ gh-home --prs
`, {
	flags: {
		prs: {
			type: 'boolean',
			default: false,
			alias: 'p'
		},
		issues: {
			type: 'boolean',
			default: false,
			alias: 'i'
		}
	}
});

const repo = cli.input[0];
const options = cli.flags;

const openUrl = (url, options) => {
	if (options.prs) {
		url = `${url}/pulls`;
	} else if (options.issues) {
		url = `${url}/issues`;
	}

	return open(url);
};

(async () => {
	if (repo) {
		if (repo.includes('/')) {
			await openUrl(`https://github.com/${repo}`, options);
		} else {
			const {stdout: user} = await execa('git', ['config', '--global', 'github.user']);
			await openUrl(`https://github.com/${user}/${repo}`, options);
		}
	} else {
		let url;
		try {
			try {
				url = await gitRemoteUpstreamUrl();
			} catch {
				url = await gitRemoteOriginUrl();
			}

			url = githubUrlFromGit(url);
		} catch {
			console.error('Couldn\'t find the remote origin or upstream. Ensure it\'s set and you\'re in a repo.\n\n  $ git remote add origin https://github.com/user/repo.git');
			process.exit(1);
		}

		if (!url) {
			console.error('Couldn\'t find the repo\'s GitHub URL. Ensure you are inside a Git repo that points to GitHub.');
			process.exit(1);
		}

		await openUrl(url, options);
	}
})();
