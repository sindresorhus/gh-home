# gh-home

> Open the GitHub page of the given or current directory repo

It will attempt to open the upstream repo if there is one or the forked repo.

## Install

```sh
npm install --global gh-home
```

## Usage

```
$ gh-home --help

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
```

## Tips

Add `alias gh=gh-home` to your `.zshrc`/`.bashrc`, so that you can run it with `$ gh` instead.

You can also use the official [GitHub CLI](https://github.com/cli/cli) instead:

```
$ gh alias set home "repo view --web"
$ gh home
```

## Related

- [npm-home](https://github.com/sindresorhus/npm-home) - Open the npm page of a package
