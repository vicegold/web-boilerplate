var config          = require('../project.json');
var scripts         = require('../tasks/build-scripts');

var colors          = require('colors');
var path            = require('path');
var chokidar        = require('chokidar');

var id              = 'Scripts'.blue.bold;
var files           = [];
var paths           = {
    dest: path.join(config.dest, config.assets.scripts.dest),
    src: path.join(config.src, config.assets.scripts.src)
};

// task called directly
if (require.main === module) {
    run();
}

/**
 * Logs a given error.
 *
 * @param {Object} error Error object.
 */
function fail(error) {
    return console.error(`${'Error'.red.bold.underline}\t${error.message}`);
}

/**
 * Function providing logic to run this task.
 *
 * @param {Object} options Running options.
 */
function run(options) {

    console.log(`${id}\tStart watching...`);

    // normalize call without parameters
    options = options || {};

    // get all (file) patterns to watch
    config.assets.scripts.files.forEach((file) => {
        files.push(path.join(paths.src, file));
    });

    // initialize watcher
    var watcher = chokidar.watch(files, {
        ignored: /[\/\\]\./,
        persistent: true
    });

    var process = path => {
        scripts.run({
            files: [ path ]
        });
    };

    watcher
        .on('error', fail)
        .on('ready', () => {

            watcher
                .on('add', process)
                .on('change', process);

        });
}

module.exports = {
    run: run
};