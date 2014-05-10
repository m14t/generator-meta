'use strict';
var composer = require('../lib/composer.js');
var yeoman = require('yeoman-generator');
var availableServices = {
    "Twig": {
        composerVersion: 'twig/twig:>=1.8,<2.0-dev',
        classname: "\\Silex\\Provider\\TwigServiceProvider",
        defaultConfig: {
            values: {
                "twig.path": "%__DIR__%/Resources/views"
            }
        },
        checked: true
    }
};

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
        var yo = this;
        var basePackages = [
            'igorw/config-service-provider:1.2.*',
            'silex/silex:1.2.*'
        ];
        var prompts = [
            {
                type: "checkbox",
                name: 'enabledServiceNames',
                message: 'What services would you like to enable in Silex?',
                choices: Object.keys(availableServices).map(function (v) {
                    return {
                        name: v,
                        checked: availableServices[v].checked
                    };
                })
            }
        ];

        this.prompt(prompts, function (props) {
            var enabledServices = yo._.filter(
                availableServices,
                function (value, key) {
                    //-- Filter out the just the enabled services
                    return -1 !== props.enabledServiceNames.indexOf(key);
                }
            );
            var enabledComposerPackages = enabledServices.map(function (config) {
                //-- We just need the composerVersion
                return config.composerVersion;
            });
            enabledComposerPackages = yo._.filter(enabledComposerPackages, function (value) {
                return "undefined" !== typeof value;
            });
            var enabledConfigOptions = {};

            //-- Composer install the required packages
            composerRequire(
                basePackages.concat(enabledComposerPackages),
                function (error, stdout, stderr) {
                    done();
                }
            );

            //-- Add the configs to our config file
            yo._.forEach(enabledServices, function (config) {
                enabledConfigOptions[config.classname] = config.defaultConfig;
            });
            augmentJsonFile.call(
                yo,
                'app/config/config.json',
                {
                    "services": enabledConfigOptions
                }
            );

            //-- Copy Service specific files into place
            yo._.forEach(props.enabledServiceNames, function (serviceName) {
                yo.directory('_serviceFiles/' + serviceName, '.');
            });
        });
    }

});

module.exports = SilexGenerator;
