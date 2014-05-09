'use strict';

module.exports = (function() {
    var _ = require('lodash');
    var exec = require('child_process').exec;

    function kvToFlag (key, value) {
        return _.template(
            '--${k} "${v}"',
            {
                k: key,
                v: value
            }
        );
    }

    function run(action, options, callback) {
        var cmd = [
            'composer',
            action
        ];

        //-- Handle optional `options` argmument
        if ('undefined' === typeof callback && 'function' === typeof options) {
            callback = options;
            options = {};
        }

        //-- Convert options array to flags
        Object.keys(options).forEach(function(key) {
            cmd.push(kvToFlag(key, options[key]));
        });

        exec(cmd.join(' '), function(error, stdout, stderr) {
            if (stderr) {
                console.error('Error running `' + cmd.join(' ') + '\n' + stderr);
            }
            if (error && error.code == 127) {
                console.warn(
                    'Composer must be installed globally. For more info, ' +
                    'see: https://getcomposer.org/doc/00-intro.md#globally.'
                );
            }

            if ('function' === typeof callback) {
                callback(error, stdout, stderr);
            }
        });
    };

    return run;
})();
