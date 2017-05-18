# gh-home [![Build Status](https://travis-ci.org/sindresorhus/gh-home.svg?branch=master)](https://travis-ci.org/sindresorhus/gh-home)

> Open the GitHub page of the given or current directory repo

It will attempt to open the upstream repo if there is one or the forked repo.


## Install

```
$ npm install --global gh-home
```


## Usage

```
$ gh-home --help

  Usage
    $ gh-home [repo | user/repo]

  Examples
    $ gh-home
    $ gh-home myrepo
    $ gh-home avajs/ava
```


## Tip

Add `alias gh=gh-home` to your `.zshrc`/`.bashrc`, so that you can run it with `$ gh` instead.


## Related

- [npm-home](https://github.com/sindresorhus/npm-home) - Open the npm page of a package
- [gh-upstream](https://github.com/RichardLitt/gh-upstream) - Open the GitHub page of the upstream remote for the repo in the current directory


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
