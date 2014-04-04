'use strict';
var yeoman = require('yeoman-generator');
var npm = require('npm');


var GruntGenerator = yeoman.generators.Base.extend({
    files: function () {
        this.mkdir('Gruntfile.d');
        this.directory('Gruntfile.d', 'Gruntfile.d');
        this.copy('Gruntfile.js', 'Gruntfile.js');
    },

    npmDeps: function () {
        var done = this.async();

        npm.load(
            {
                save: true
            },
            function (er, npm) {
                npm.commands.install(
                    [
                        'grunt@^0.4.4',
                        'lodash@^2.4.1',
                        'matchdep@^0.3.0'
                    ],
                    function (er, installed) {
                        done();
                    }
                );
            }
        );

    }
});

module.exports = GruntGenerator;
