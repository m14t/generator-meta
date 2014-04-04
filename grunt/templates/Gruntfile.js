/* global module, require */

var _ = require('lodash');
var _matchdep = require('matchdep');

module.exports = function(grunt) {

    'use strict';

    function mergeConfigFiles(userConfig) {
        var config = {};
        var files = grunt.file.expand('Gruntfile.d/*.json');
        files.map(grunt.file.readJSON).forEach(function(entry) {
            _.merge(config, entry);
        });

        //-- merge in the user's config last so it has the highest precedence
        _.merge(config, userConfig);

        return config;
    }

    var config = {
        //-- Put your project specific config variables here!
        pkg: grunt.file.readJSON('package.json')
    };
    config = mergeConfigFiles(config);
    grunt.initConfig(config);

    //-- Load plugins.
    _matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', []);
};
