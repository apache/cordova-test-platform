
# New Platform Checklist
 
## Stand-alone scripts
 
bin/create scripts
- bin/create _(typically a node script)_
- bin/create.bat for windows
    - windows .bat file typically just calls bin/create with node
 
bin/update
- not entirely sure this code is run, or needs to exist with newish non-destructive platform updates
 
## Package Expectations
 
- Platforms must have a package.json in their root.
- Package.json exports a 'main', usually `"main": "src/cordova/Api.js"`
    - This allows other modules to simply require() the path to this platform and get access to the Api.
 
## Api (Platform) Expectations
- The PlatformApi class
    - The PlatformApi class is an abstraction around a particular platform that exposes all the actions, properties, and methods for this platform so they are accessible programmatically.
    - It can install & uninstall plugins with all source files, web assets and js files.
    - It exposes a single 'prepare' method to provide a way for cordova-lib to apply a project's setting/www content to the platform.
    - The PlatformApi class should be implemented by each platform that wants to use the new API flow. For those platforms, which don't provide their own PlatformApi, there will be a polyfill in cordova-lib.
    - Platforms that implement their own PlatformApi instance should implement all prototype methods of this class to be fully compatible with cordova-lib.
    - The PlatformApi instance should define the following field:
        - platform : This is a String that defines a platform name.
 
- Api.js exports static functions
    - there is currently a requirement that the file be called Api.js (todo:change that)
 
 
- Api.js exports static function `updatePlatform(destination, options, events);`
    - PlatformApi.updatePlatform = function (cordovaProject, options) {};
    - The `updatePlatform` method is equal to the bin/update script. It should update an already installed platform. It should accept a CordovaProject instance, that defines a project structure and configuration, that should be applied to the new platform, and an options object.
    - cordovaProject: This is a CordovaProject instance that defines a project structure and configuration, that should be applied to the new platform. This argument is optional and if not defined, that platform is used as a standalone project and not as part of a Cordova project.
    - options : This is an options object. The most common options are :
        - options.customTemplate : This is a path to custom template, that should override the default one from platform.
        - options.link : This is a flag that should indicate that the platform's sources will be linked to the installed platform instead of copying.
     - The `updatePlatform` method must return a promise, which is either fulfilled with a PlatformApi instance or rejected with a CordovaError.
 
- Api.js exports static function `createPlatform(destination, cfg, options, events);`
    - PlatformApi.createPlatform = function(cordovaProject, options) {};
    - The `createPlatform method` is equal to the bin/create script. It should install the platform to a specified directory and create a platform project. It should accept a CordovaProject instance, that defines a project structure and configuration, that should be applied to the new platform, and an options object.
    - cordovaProject : This is a CordovaProject instance that defines a project structure and configuration, that should be applied to the new platform. This argument is optional and if not defined, that platform is used as a standalone project and not as part of a Cordova project.
    - options : This is an options object. The most common options are :
        - options.customTemplate : This is a path to custom template, that should override the default one from the platform.
        - options.link : This is a flag that should indicate that the platform's sources will be linked to the installed platform instead of copying.
    - The `createPlatform` method must return a promise, which is either fulfilled with a PlatformApi instance or rejected with a CordovaError.
 
The way most platforms work is somewhat tricky.  The Api.js could be anywhere in the platform repo, ex. /templates/cordova/Api.js .  When a new project is created for the platform, the platform copies this file (and supporting files ) to destination/cordova/Api.js.  The project expectations demand that the Api.js file be available at /projectRoot/platforms/platform-name/cordova/Api.js.
 
A call to the platforms static Api.createPlatform will
1. Copy template files to destination (according to cfg, options).
1. Copy the file Api.js (and supporting modules) to destination/cordova/Api.js.
1. Return a promise that will eventually resolve with an instance of the newly copied Api.js.
    - This step is a bit confusing because at this point in time we have 2 Api.js in memory, one from the platform folder which has static methods, and one from the new project folder which has instance methods.
    - Similarly, they may have their own require() statements, and while typically require would return the same instance, because our modules are loaded from different paths, they get different relative requires also.
 
 
## Api (Project) Expectations
 
- Api.js exports a constructor function
    var Api = require('path/Api.js');
    var api = new Api(); // This should work, although it's not typical usage.
 
- These following methods are equal to the platform's executable scripts. The main difference is that they accept a structured options object instead of an array of command line arguments.
- has a `requirements` method
    - PlatformApi.prototype.requirements = function() {};
    - The `requirements` method should perform a requirements check for the current platform. Each platform is expected to define its own set of requirements, which should be resolved before the platform can be built successfully.
    - The `requirements` method must return a promise, resolved with a set of Requirement objects for the current platform.
- has a `clean` method
    - PlatformApi.prototype.clean = function() {};
    - The `clean` method should clean out the build artifacts from the platform's directory.
    - The `clean` method must return a promise either fulfilled or rejected with a CordovaError.
- has a `build` method
    - PlatformApi.prototype.build = function(buildOptions) {};
    - The `build` method should build an application package for the current platform.
    - buildOptions : This is an options object. The most common options are:
        - buildOptions.debug : This indicates that that packages should be built with debug configuration. This is set true by default unless the 'release' option is not specified.
        - buildOptions.release : This indicates that packages should be built with release configuration. If not set to true, debug configuration should be used.
        - buildOptions.device : This indicates that the built app is intended to run on device.
        - buildOptions.emulator : This indicates that the built app is intended to run on an emulator.
        - buildOptions.target : This indicates the device id that will be used to run the built app.
        - buildOptions.nobuild : This indicates that this should be a dry-run call. No build artifacts should be produced.
        - buildOptions.archs : This indicates chip architectures with app packages should be built for. The list of valid architectures is dependent on the platform.
        - buildOptions.buildConfig : This is the path to the build configuration file. The format of this file is dependent on the platform.
        - buildOptions.argv : This is a raw array of command-line arguments that should be passed to the `build` command. The purpose of this property is to pass platform-specific arguments, and eventually let the platform define its own arguments processing logic.
        - The `build` method must return a promise either fulfilled with an array of build artifacts (application packages) if the package was built successfully, or rejected with a CordovaError. The return value in most cases will contain only one items, but in some cases there could be multiple items in an output array, e.g. when multiple architectures are specified. The resultant build artifact objects are not strictly typed and may contain an arbitrary set of fields as in the sample below.
 
        ```
        {
            architecture: 'x86',
            buildType: 'debug',
            path: '/path/to/build',
            type: 'app'
 
        }
        ```
 
- has a `run` method
    - PlatformApi.prototype.run = function(runOptions) {};
    - The `run` method should build an application package for the current platform and runs it on the specified/default device. If no 'device'/'emulator'/'target' options are specified, then it should try to run the app on a default device if connected, otherwise it should run on the app on the emulator.
    - runOptions : This is an options object. The structure is the same as for build options.
    - The `run` method must return a promise either fulfilled if the package was build and ran successfully, or rejected with a CordovaError.
 
 
- has an `addPlugin` method
    - PlatformApi.prototype.addPlugin = function (plugin, installOptions) {};
    - The `addPlugin` method should install a plugin into a platform. It should handle all the non-www files shipped by plugin (sources, libs, assets, js-files) and accept a PluginInfo instance that represents the plugin that will be installed and an options object. It cannot resolve the dependencies of a plugin.
    - plugin : This is a PluginInfo instance that should represent the plugin that will be installed. It is expected to accept a plugin spec that should be one of the following:
        - valid plugin id that can be resolved through either cordova plugin registry or npm: 'org.apache.cordova.globalization', 'cordova-plugin-globalization'
        - valid npm identifier, that resolves to valid plugin : cordova-plugin-globalization@1.0.0
        - git url, that points to a repo with a valid plugin: http://github.com/apache/cordova-plugin-globalization.git#r.1.0.0
        - path to local repo of valid plugin: /my/cordova/repositories/cordova-plugin-globalization
    - installOptions : This is an options object with the following possible options:
        - installOptions.link : This is a flag that should specify that plugin sources will be symlinked to app's directory instead of copying (if possible).
        - installOptions.variables : This is an object that should represent variables that will be used to install a plugin.
    - The `addPlugin` method must return a promise either fulfilled or rejected with a CordovaError instance.
- has a `removePlugin` method
    - PlatformApi.prototype.removePlugin = function (plugin) {};
    - The `removePlugin` method should remove an installed plugin from a platform. It should accept a PluginInfo instance that represents the plugin that will be removed and an options object.
    - Note: Since this method accepts the PluginInfo instance as an input parameter, instead of a plugin id, the caller should take care of managing and storing the PluginInfo instances for future uninstalls.
    - plugin : This is a PluginInfo instance that should represent the plugin that will be uninstalled. It is expected to accept a plugin spec that should be one of the following:
        - valid plugin id that can be resolved through either cordova plugin registry or npm: 'org.apache.cordova.globalization', 'cordova-plugin-globalization'
        - valid npm identifier, that resolves to valid plugin : cordova-plugin-globalization@1.0.0
        - girl url, that points to a repo with a valid plugin: http://github.com/apache/cordova-plugin-globalization.git#r.1.0.0
        - path to local repo of valid plugin: /my/cordova/repositories/cordova-plugin-globalization
    - The `removePlugin` method must return a promise either fulfilled or rejected with a CordovaError instance.
 
- CLI work flow integration
- has a `prepare` method
    - PlatformApi.prototype.prepare = function (cordovaProject) {};
    - The `prepare` method should update the installed platform with provided www assets and new app configuration. This method is required for CLI work flow and should be called each time before build, so the changes, made to app configuration and www code, will be applied to the platform.
    - Note: The prepare method doesn't rebuild the cordova_plugins file and doesn't reapply assets and js files installed by plugins to the platform's www directory.
    - cordovaProject : This is a CordovaProject instance, that defines a project structure and configuration, that should be applied to the platform. (It contains the project's www location and ConfigParser instance for the project's config.)
    - The `prepare` method must return a promise either fulfilled, or rejected with a CordovaError instance.
 
- Platform-specific information
- has a `getPlatformInfo` method
    - PlatformApi.prototype.getPlatformInfo = function () {};
    - The `getPlatformInfo` method should get a CordovaPlatform object that represents the platform structure. (Platform's directories/main file locations such as config.xml, www, etc.)
    - The `getPlatformInfo` method must return a CordovaPlatform object that contains the description of the platform's file structure and other properties of the platform.
