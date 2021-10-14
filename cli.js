#!/usr/bin/env node
import process from 'node:process';
import meow from 'meow';
import gitRemoteOriginUrl from 'git-remote-origin-url';
import gitRemoteUpstreamUrl from 'git-remote-upstream-url';
import githubUrlFromGit from 'github-url-from-git';
import open from 'open';
import execa from 'execa';

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
	importMeta: import.meta,
	flags: {
		prs: {
			type: 'boolean',
			default: false,
			alias: 'p',
		},
		issues: {
			type: 'boolean',
			default: false,
			alias: 'i',
		},
	},
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
			console.error('Could not find the remote origin or upstream. Ensure it\'s set and you\'re in a repo.\n\n  $ git remote add origin https://github.com/user/repo.git');
			process.exirCode = 1;
			return;
		}

		if (!url) {
			console.error('Could not find the repo\'s GitHub URL. Ensure you are inside a Git repo that points to GitHub.');
			process.exitCode = 1;
			return;
		}

		await openUrl(url, options);
	}
})();
