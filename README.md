Deprecated: Verify [this](https://github.com/saibs/list-repos)
# angular-seed-es6-enterprise

## Description

Angular JS enterprise seed project using Angular 1.X and written in ES6.

## Technologies used

* [AngularJS](https://angularjs.org/) : Single page javascript framework
* [Grunt](http://gruntjs.com/): Build system
* [Bower](http://bower.io/) and [NPM](https://www.npmjs.com/) : Package managers
* [Karma](http://karma-runner.github.io/0.12/index.html) : Unit test runner
* [Jasmine](http://jasmine.github.io/2.0/introduction.html) : BDD (Behavior Driven Development) oriented test framework
* [Protractor](http://angular.github.io/protractor/#/) : End to end testing for AngularJS (UI Test)
* [ES6](http://es6-features.org/) : Uses the latest version of Javascript. This is not supported by every browser, so have to transpile it to ES5 in the build system. Currently using [Browserify](http://browserify.org/)(Used with `Grunt` via `grunt-browserify` to support module loading , and [Babel](https://babeljs.io/) as transpiler(Used with `Browserify` via `babelify`).

## Features

* Support for Internationalization and  Pluralization [Angular GetText](https://github.com/rubenv/angular-gettext)
     The widely used gettext format is used. This means you can use widely established translation tools like              [Poedit](http://poedit.net/). Or you can use an online translation platforms.
* Develop with latest Javascript i.e ES6.

## Setup

- You need [NodeJS and NPM](https://nodejs.org/) installed.
- Install build system: `npm install -g grunt`.
- Then install application dependencies.
  `npm install`

## Development

To start working, you need to build and launch the development server. There is a file watcher to reload the browser when you save a file. Do this via the command: `grunt serve`.
