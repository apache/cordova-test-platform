
# New Platform Checklist

## Stand alone scripts

bin/create scripts
- bin/create _(typically a node script)_
- bin/create.bat for windows
    - windows .bat file typically just calls bin/create with node

bin/update
- not entirely sure this code is run, or needs to exist with newish non-destructive platform updates

## Package Expectations

- platforms have a package.json in their root
- package.json exports a 'main', usually `"main": "src/cordova/Api.js"`
    - this allows other modules to simply require() the path to this platform and get access to the Api

## Api (Platform) Expectations
- Api.js exports static functions
    - there is currently a requirement that the file be called Api.js (todo:change that)

    - Api.js exports static function `updatePlatform(destination, options, events);`
        - todo: document params, and returns
     - Api.js exports static function `createPlatform(destination, cfg, options, events);`
        - todo: document params, and returns

The way most platforms work is somewhat tricky.  The Api.js could be anywhere in the platform repo, ex. /templates/cordova/Api.js  When a new project is created for the platform, the platform copies this file ( and supporting files ) to destination/cordova/Api.js.  The project expectations demand that the Api.js file be available at /projectRoot/platforms/platform-name/cordova/Api.js.

A call to the platforms static Api.createPlatform will
1. copy template files to destination ( according to cfg, options )
1. copy the file Api.js ( and supporting modules ) to destination/cordova/Api.js
1. return a promise that will eventually resolve with an instance of the newly copied Api.js
    - this step is a bit confusing because at this point in time we have 2 Api.js in memory, one from the platform folder which has static methods, and one from the new project folder which has instance methods.
    - similarly, they may have their own require() statements, and while typically require would return the same instance, because our modules are loaded from different paths, they get different relative requires also.


## Api (Project) Expectations

- Api.js exports a constructor function
    var Api = require('path/Api.js');
    var api = new Api(); // this should work, although it's not typical usage

- has a `requirements` method
    - todo: document params, and returns
- has a `clean` method
    - todo: document params, and returns
- has a `run` method
    - todo: document params, and returns
- has a `build` method
    - todo: document params, and returns
- has a `addPlugin` method
    - todo: document params, and returns
- has a `removePlugin` method
    - todo: document params, and returns
- has a `prepare` method
    - todo: document params, and returns
- has a `getPlatformInfo` method
    - todo: document params, and returns


