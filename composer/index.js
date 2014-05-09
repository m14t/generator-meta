'use strict';
var composer = require('../lib/composer.js');
var npm = require('npm');
var yeoman = require('yeoman-generator');

var ComposerGenerator = yeoman.generators.Base.extend({
    npmDepsAndFiles: function () {
        var done;

        if (true === this.options.useGrunt) {
            done = this.async();

            this.copy('Gruntfile.d/composer.json', 'Gruntfile.d/composer.json');

            npm.load(
                {
                    save: true
                },
                function (er, npm) {
                    npm.commands.install(
                        [
                            'grunt-composer@^0.2.0',
                            'grunt-contrib-watch@^0.6.1'
                        ],
                        function (er, installed) {
                            done();
                        }
                    );
                }
            );
        }
    },

    composerInit: function() {
        var composerOpts = {};
        var done = this.async();

        if (
            this.options.githubUser && "" != this.options.githubUser.trim() &&
            this.options.projectName && "" != this._.slugify(this.options.projectName)
        ) {
            composerOpts.name = this.options.githubUser.trim() + "/" +
                this._.slugify(this.options.projectName.replace(/(.)([A-Z])/g, "$1 $2"));
        }

        if (this.options.projectDescription && "" != this.options.projectDescription.trim()) {
            composerOpts.description = this.options.projectDescription.trim();
        }

        composer('init', composerOpts, function(error, stdout, stderr) {
            done();
        });
    }

});

module.exports = ComposerGenerator;
