## Not a Sock Drawer v0.1.0
#### A less-than-typical but logically structured angular+expressjs web app skeleton

Inspired by [this pretty cool article](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript)
by [this pretty cool dev](https://twitter.com/cliffmeyers).

### Getting Started

In an existing git project (right after `git init`):

 1. `git remote add skeleton https://github.com/bericp1/skeleton`
 2. `git pull skeleton master`
  * Change `master` to `master:dev` if you want to develop on a `dev` branch
 3. `npm install`
 4. `grunt setup`

### Structure

 * `/lib/`:     first-party node modules
 * `/public/`:  front end; see [README](public/ "public/")
 * `/routes/`:  express routes; see [README](routes/ "routes/")
 * `/tasks/`:   grunt tasks

### Deploying to Heroku

`skeleton` now uses [heroku-buildpack-nodejs-grunt](https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt) so
the entire dev version of the app is pushed to heroku and this custom build pack will run the appropriate build tasks.
This eliminates the need to commit production changes and then roll them back after deployment.

### Testing

Yet to be implemented :-(

### TODO

 * TESTING!!!!!!11!11!!1!
 * Better explain what happens in the dev/build/deploy cycle (for now, check[me](./Gruntfile.js "the Gruntfile") out)
 * ~~Implement LESS~~
 * Implement require.js for angular modules for easier module loading
 * Better solution for angular templates, if possible
 * ~~Implement usemin, concat, and uglify~~
 * Implement cache busting of all assets referenced in all files (templates, css files, etc.)
 * Improve heroku-specific setup process to account for errors, pipe std* instead of buffering to a string, and more
 * Eventually turn this into a yeoman buildpack thing or a standalone tool altogether
 * Improve rename setup process so that it doesn't rely on simple find/replace and and actually knows where to change the app name
 * Make these TODO items actual bugs on github -_-
 * Lots more...