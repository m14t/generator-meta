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

        var prompts = [
            {
                name: 'projectName',
                message: 'What would you like to call this project?',
                validate: function (value) {
                    if ("" == value) {
                        return "Please specify a projectName";
                    }

                    return true;
                }
            },
            {
                name: 'projectDescription',
                message: 'How would you describe it?'
            },
            {
                name: 'githubUser',
                message: 'Would you mind telling me your username on GitHub?',
                default: this.githubUser
            },
            {
                type: 'confirm',
                name: 'useGrunt',
                message: 'Would you like to use Grunt on this project?',
                default: true
            },
            {
                type: 'list',
                name: 'projectType',
                message: 'Would type of project is this going to be?',
                choices: [
                    'silex'
                ],
                default: 0
            }
        ];

        this.prompt(prompts, function (props) {
            var yo = this;

            // Copy all props to the this object
            this._.merge(this, props);

            if (true === this.useGrunt) {
                this.invoke(
                    'meta:grunt'
                );
            }

            switch (this.projectType) {
                case 'silex':
                    yo.invoke('meta:composer', {options: props}, function() {
                    });
                    break;
            }

            done();
        }.bind(this));
    },

    configFiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
        this.copy('jshintignore', '.jshintignore');
        this.template('_package.json', 'package.json');
    }
});

module.exports = MetaGenerator;
