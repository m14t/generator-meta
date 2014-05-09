'use strict';
var composer = require('../lib/composer.js');
var yeoman = require('yeoman-generator');

function augmentJsonFile(file, data) {
    var current = JSON.parse(this.readFileAsString(file));

    this._.merge(current, data);

    this.writeFileFromString(
        JSON.stringify(current, null, 4),
        file
    );
}


function composerRequire(packageList, callback) {
    var packages = packageList.map(function (v) { return "'" + v + "'"; }).join(' ');

    composer(
        "require " + packages,
        callback
    );
}

var SilexGenerator = yeoman.generators.Base.extend({
    configureAutoloader: function () {
        var done = this.async();
        var autoloadOpts = {
            'autoload': {
                'files': [
                    'app/AppKernel.php'
                ],
                'psr-0': {
                }
            }
        };
        autoloadOpts.autoload['psr-0'][this.options.projectNamespace] = 'src';

        augmentJsonFile.call(this, 'composer.json', autoloadOpts);

        composer('dump-autoload', function (error, stdout, stderr) {
            done();
        });
    },

    files: function () {
        // Copy all props to the this object
        this._.merge(this, this.options);

        this.directory('app', 'app');
        this.template('_AppKernel.php', 'app/AppKernel.php');

        this.mkdir('web');
        this.directory('web', 'web');
        this.template('_app.php', 'web/app.php');

        this.mkdir('src/' + this.options.projectNamespace);
    },

    configureServices: function () {
        var done = this.async();
        var basePackages = [
            'silex/silex:1.2.*'
        ];

        //-- Composer install the required packages
        composerRequire(
            basePackages,
            function (error, stdout, stderr) {
                done();
            }
        );
    }

});

module.exports = SilexGenerator;
