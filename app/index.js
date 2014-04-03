'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var exec = require('child_process').exec;

var MetaGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    /**
     * Attempt to get the user's GitHub username if they followed the
     * instructions on https://github.com/blog/180-local-github-config
     */
    getGithubUsername: function () {
        var done = this.async();
        var yeomanGlobal = this;

        // Attempt to get the user's github username
        exec(
            'git config --global github.user',
            function(error, stdout, stderr) {
                yeomanGlobal.githubUser = stdout.replace(/\n$/, '');
                done();
            }
        );
    },

    askFor: function () {
        var done = this.async();

        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('You\'re using the fantastic Meta generator.'));

        var prompts = [{
            type: 'confirm',
            name: 'someOption',
            message: 'Would you like to enable this option?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.someOption = props.someOption;

            done();
        }.bind(this));
    },

    app: function () {
        this.mkdir('app');
        this.mkdir('app/templates');

        this.copy('_package.json', 'package.json');
        this.copy('_bower.json', 'bower.json');
    },

    projectfiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
    }
});

module.exports = MetaGenerator;
