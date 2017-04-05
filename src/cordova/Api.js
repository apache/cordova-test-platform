/*
    this file is found by cordova-lib when you attempt to
    'cordova platform add PATH' where path is this repo.
*/

/*jslint node: true */

var shell = require('shelljs');
var path = require('path');

var PLATFORM_NAME = 'testplatform';

function setupEvents(externalEventEmitter) {
    if (externalEventEmitter) {
        // This will make the platform internal events visible outside
        selfEvents.forwardEventsTo(externalEventEmitter);
        return externalEventEmitter;
    }

    // There is no logger if external emitter is not present,
    // so attach a console logger
    CordovaLogger.get().subscribe(selfEvents);
    return selfEvents;
}

function Api(platform, platformRootDir, events) {

    this.platform = platform || PLATFORM_NAME;
    this.root = path.resolve(__dirname, '..');

    this.locations = {
        platformRootDir: platformRootDir,
        root: this.root,
        www: path.join(this.root, 'assets/www'),
        res: path.join(this.root, 'res'),
        platformWww: path.join(this.root, 'platform_www'),
        configXml: path.join(this.root, 'res/xml/config.xml'),
        defaultConfigXml: path.join(this.root, 'cordova/defaults.xml'),
        build: path.join(this.root, 'build'),
        // NOTE: Due to platformApi spec we need to return relative paths here
        cordovaJs: 'bin/templates/project/assets/www/cordova.js',
        cordovaJsSrc: 'cordova-js-src'
    };

}

Api.createPlatform = function (destination, config, options, events) {

    // create the destination and the standard place for our api to live
    // platforms/platformName/cordova/Api.js
    shell.mkdir(destination);
    shell.mkdir(path.join(destination,'cordova'));

    var apiPath = path.join(__dirname, '**'); // default value
    // does options contain the info we desire?
    if(options && options.platformDetails) {
        apiPath = path.join(options.platformDetails.libDir, '**');
    }

    // move a copy of our api to the new project
    shell.cp(apiPath, path.join(destination, 'cordova'));

    var result = Promise.resolve();
    result.then(function(){
       return new Api(PLATFORM_NAME,destination,events);
    });
    return result;
};


Api.updatePlatform = function (destination, options, events) {
    // console.log("test-platform:Api:updatePlatform");
    // todo?: create projectInstance and fulfill promise with it.
    return Promise.resolve();
};

Api.prototype.getPlatformInfo = function () {
    console.log("test-platform:Api:getPlatformInfo");
    // return PlatformInfo object

    return {
        "locations":this.locations,
        "root": this.root,
        "name": this.platform,
        "version": { "version" : "1.0.0" },
        "projectConfig": this._config
    };
};

Api.prototype.prepare = function (cordovaProject) {
    console.log("test-platform:Api:prepare");
    return Promise.resolve();
};

Api.prototype.addPlugin = function (plugin, installOptions) {
    console.log("test-platform:Api:addPlugin");
    return Promise.resolve();
};

Api.prototype.removePlugin = function (plugin, uninstallOptions) {
    console.log("test-platform:Api:removePlugin");
    return Promise.resolve();
};

Api.prototype.build = function (buildOptions) {
    console.log("test-platform:Api:build");
    return Promise.resolve();
};

Api.prototype.run = function(runOptions) {
    console.log("test-platform:Api:run");
};

Api.prototype.clean = function(cleanOptions) {
    console.log("test-platform:Api:clean");
    return Promise.resolve();
};

Api.prototype.requirements = function() {
    console.log("test-platform:Api:requirements");
    return true;
};

module.exports = Api;
