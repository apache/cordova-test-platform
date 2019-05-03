<!--
# license: Licensed to the Apache Software Foundation (ASF) under one
#         or more contributor license agreements.  See the NOTICE file
#         distributed with this work for additional information
#         regarding copyright ownership.  The ASF licenses this file
#         to you under the Apache License, Version 2.0 (the
#         "License"); you may not use this file except in compliance
#         with the License.  You may obtain a copy of the License at
#
#           http://www.apache.org/licenses/LICENSE-2.0
#
#         Unless required by applicable law or agreed to in writing,
#         software distributed under the License is distributed on an
#         "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#         KIND, either express or implied.  See the License for the
#         specific language governing permissions and limitations
#         under the License.
-->

# New Platform Checklist
 
## Package Expectations
 
- Platforms must have a `package.json` in their root.
- `package.json` must export a 'main'. E.g. `"main": "src/cordova/Api.js"`
    - A 'main' must exist, and it must be an instance of the `PlatformApi` with methods as you define later.
    - This allows other modules to simply `require()` the path to this platform and get access to the Api.
 
## Api (Platform) Expectations

- The PlatformApi class
    - The `PlatformApi` class is an abstraction around a particular platform that exposes all the actions, properties, and methods for this platform so they are accessible programmatically.
    - It can install & uninstall plugins with all source files, web assets and js files.
    - It exposes a single `prepare` method to provide a way for `cordova-lib` to apply a project's setting and www content to the platform. It interpolates metadata, such as application name or description from a Cordova project's `config.xml` into the format expected by the platform. (See [`config.xml` documentation](https://cordova.apache.org/docs/en/latest/config_ref/).)
    - Platforms that implement their own `PlatformApi` instance must implement all prototype methods of this class to be fully compatible with `cordova-lib`.
    - Required methods for platforms include: `create` , `requirements`, `prepare`, `addPlugin`, and `removePlugin`
    - Optional methods for platforms include: `build`, `run`
    - The `PlatformApi` instance should define the following field:
        - __platform__: This is a String that defines a platform name.

- Api.js must export a static function `createPlatform(destination, cfg, options, events);` that returns a new instance of the `PlatformApi`.
    - `PlatformApi.createPlatform = function(cordovaProject, options) {};`
    - `.createPlatform`: is equal to the `bin/create` script. It should install the platform to a specified directory and create a platform project. It should accept a `CordovaProject` instance, that defines a project structure and configuration, that should be applied to the new platform, and an options object.
    - __cordovaProject__: This is a `CordovaProject` instance that defines a project structure and configuration, that should be applied to the new platform. This argument is optional and if not defined, that platform is used as a standalone project and not as part of a Cordova project. (See [CordovaProject documentation](https://github.com/apache/cordova-android/blob/master/bin/templates/cordova/Api.js#L178).)
    - __options__: This is an options object. The most common options are:
        - __options.customTemplate__: This is a path to custom template, that should override the default one from the platform.  If options.customTemplate is present `create` should copy from there instead of it's own template. Example:
            ```js
            var project_template_dir = options.customTemplate || path.join(ROOT, 'bin', 'templates', 'project');
                // copy project template
                shell.cp('-r', path.join(project_template_dir, 'assets'), project_path);
                shell.cp('-r', path.join(project_template_dir, 'res'), project_path);
            ```
            - Templates allow developers to create apps based on boilerplate application code.
            - A default template is standard structure for a `Cordova` platform.
            - (See [template documentation](https://cordova.apache.org/docs/en/latest/guide/cli/template.html).)
        - __options.link__: This is a flag that should indicate that the platform's sources will be linked to the installed platform instead of copying.
    - `.createPlatform` must return a promise, which is either fulfilled with a `PlatformApi` instance or rejected with a `CordovaError`.
 
The Api.js could be anywhere in the platform repo, ex. `/templates/cordova/Api.js`. When a new project is created for the platform, the platform copies this file (and supporting files) to `destination/cordova/Api.js`.  The project expectations demand that the Api.js file be available at `/projectRoot/platforms/platform-name/cordova/Api.js`.
 
A call to the platforms static `Api.createPlatform` will:

1. Copy template files to destination (according to cfg, options).
1. Copy the file `Api.js` (and supporting modules) to `destination/cordova/Api.js`.
1. Return a promise that will eventually resolve with an instance of the newly copied Api.js.
    - __Note:__ at this point in time we have 2 Api.js in memory, one from the platform folder which has static methods, and one from the new project folder which has instance methods.
    - Similarly, they may have their own `require()` statements, and while typically require would return the same instance, because our modules are loaded from different paths, they get different relative requires also.
 
## Api (Project) Expectations
 
- Api.js exports a constructor function
    -   This is NOT a requirement. All instances of the platform api are typically created and returned by the createPlatform function.
    - The newly created platform (which copies code from the template to the project dir) must export a constructor.
        ```js
        var Api = require('path/Api.js');
        var api = new Api();
        ```

## Stand-alone scripts
 
- `bin/create` scripts
    - `bin/create _(typically a node script)_
    - `bin/create.bat` for windows
        - windows `.bat` file typically just calls `bin/create` with node
    - invoking this script would create a platform-specific, cordova-compatible project shell
 
## Methods

These following methods are equal to the platform's executable scripts. The main difference is that they accept a structured options object instead of an array of command line arguments.

This documentation follows the following pattern:

- Method name and call signature
    - Description of functionality
    - Details on eventual parameters
    - Description of return value

### PlatformApi.prototype.requirements = function() {};

- `.requirements` should perform a requirements check for the current platform. Each platform is expected to define its own set of requirements, which should be resolved before the platform can be built successfully.
    - __Example:__ the `cordova-android` platform requires tooling from the Android SDK, and uses this method to check that the operating system has access to all necessary tooling.
- The `.requirements` must return a promise, resolved with a set of `Requirement` objects for the current platform.
- (See [Requirements documentation](https://github.com/apache/cordova-android/blob/master/bin/templates/cordova/Api.js#L385).) TODO broken link

### PlatformApi.prototype.clean = function() {};

- `.clean` should clean out the build artifacts from the platform's directory.
- `.clean` must return a promise either fulfilled or rejected with a `CordovaError`.
- (See [CordovaError documentation](https://github.com/apache/cordova-common/blob/master/README.md#cordovaerror).) TODO why this link here?

### PlatformApi.prototype.build = function(buildOptions) {};

- `.build` should build an application package for the current platform.
- __buildOptions__: an options object. The most common options are:
    - __buildOptions.debug__: indicates that that packages should be built with debug configuration. It is set true by default unless the 'release' option is not specified.
    - __buildOptions.release__: indicates that packages should be built with release configuration. If not set to true, debug configuration should be used.
    - __buildOptions.device__: indicates that the built app is intended to open on device.
    - __buildOptions.emulator__: indicates that the built app is intended to open on an emulator.
    - __buildOptions.target__: indicates the device id that will be used to open the built app.
    - __buildOptions.nobuild__: indicates that this should be a dry-run call. No build artifacts should be produced.
    - __buildOptions.archs__: indicates chip architectures with app packages should be built for. The list of valid architectures is dependent on the platform.
    - __buildOptions.buildConfig__: is the path to the build configuration file. The format of this file is dependent on the platform. Examples: 
        - (See [Android `build.json` documentation](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#using-buildjson).)
        - (See [iOS `build.json` documentation](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html#using-buildjson).)
    - __buildOptions.argv__: is a raw array of command-line arguments that should be passed to the `build` command. The purpose of this property is to pass platform-specific arguments, and eventually let the platform define its own arguments processing logic.
- `.build` must return a promise either fulfilled with an array of build artifacts (application packages) if the package was built successfully, or rejected with a `CordovaError`. 
    - The return value in most cases will contain only one item, but in some cases there could be multiple items in an output array, e.g. when multiple architectures are specified. The resultant build artifact objects are not strictly typed and may contain an arbitrary set of fields as in the sample below.
    ```
    {
        architecture: 'x86',
        buildType: 'debug',
        path: '/path/to/build',
        type: 'app'
    }
    ```
 
### PlatformApi.prototype.run = function(runOptions) {};

- `.run` should build an application package for the current platform and runs it on the specified/default device. If no 'device'/'emulator'/'target' options are specified, then it should try to launch the app on a default device if connected, otherwise it should launch on the app on the emulator.
- __runOptions__: This is an options object. The structure is the same as for build options.
- `.run` must return a promise either fulfilled if the package was build and ran successfully, or rejected with a `CordovaError`.
 
 
### PlatformApi.prototype.addPlugin = function (plugin, installOptions) {};

- `.addPlugin` should install a plugin into a platform. It should handle all the non-www files shipped by plugin (sources, libs, assets, js-files) and accept a `PluginInfo` instance that represents the plugin that will be installed and an options object. It cannot resolve the dependencies of a plugin.
- (See [`plugin.xml` documentation](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html).) TODO see for what?
- __plugin__: This is a `PluginInfo` instance that should represent the plugin that will be installed. (See [PluginInfo documentation](https://github.com/apache/cordova-common/blob/master/README.md#plugininfoprovider-and-plugininfo).)
    - It is expected to accept a plugin spec that should be one of the following:
        - valid plugin id that can be resolved through npm: `cordova-plugin-globalization`
        - valid npm identifier, that resolves to valid plugin: `cordova-plugin-globalization@1.0.0`
        - git url, that points to a repo with a valid plugin: `http://github.com/apache/cordova-plugin-globalization.git#r.1.0.0`
        - path to local repo of valid plugin: `/my/cordova/repositories/cordova-plugin-globalization`
- __installOptions__: This is an options object with the following possible options:
    - __installOptions.link__: This is a flag that should specify that plugin sources will be symlinked to app's directory instead of copying (if possible).
    - __installOptions.variables__: This is an object that should represent variables that will be used to install a plugin. (See [variable documentation](https://cordova.apache.org/docs/en/latest/config_ref/#variable).)
- `.addPlugin` must return a promise either fulfilled or rejected with a `CordovaError` instance.

### PlatformApi.prototype.removePlugin = function (plugin) {};

- `.removePlugin` should remove an installed plugin from a platform. It should accept a `PluginInfo` instance that represents the plugin that will be removed and an options object.
- __Note__: Since this method accepts the `PluginInfo` instance as an input parameter, instead of a plugin id, the caller should take care of managing and storing the `PluginInfo` instances for future uninstalls.
- __plugin__: This is a `PluginInfo` instance that should represent the plugin that will be uninstalled. (See [PluginInfo documentation](https://github.com/apache/cordova-common/blob/master/README.md#plugininfoprovider-and-plugininfo).)
    - It is expected to accept a plugin spec that should be one of the following:
        - valid plugin id that can be resolved through npm: `cordova-plugin-globalization`
        - valid npm identifier, that resolves to valid plugin: `cordova-plugin-globalization@1.0.0`
        - git url, that points to a repo with a valid plugin: `http://github.com/apache/cordova-plugin-globalization.git#r.1.0.0`
        - path to local repo of valid plugin: `/my/cordova/repositories/cordova-plugin-globalization`
- `.removePlugin` must return a promise either fulfilled or rejected with a `CordovaError` instance.

### PlatformApi.prototype.prepare = function (cordovaProject) {};

- `.prepare` should update the installed platform with provided www assets and new app configuration. This method is required for CLI work flow and should be called each time before build, so the changes, made to app configuration and www code, will be applied to the platform.
- __Note:__ `.prepare` doesn't rebuild the cordova_plugins file and doesn't reapply assets and js files installed by plugins to the platform's www directory.
- __cordovaProject__: This is a `CordovaProject` instance, that defines a project structure and configuration, that should be applied to the platform. (See [CordovaProject documentation](https://github.com/apache/cordova-android/blob/master/bin/templates/cordova/Api.js#L178).) (It contains the project's www location and `ConfigParser` instance for the project's config.)
- `.prepare` must return a promise either fulfilled, or rejected with a `CordovaError` instance.
 
### PlatformApi.prototype.getPlatformInfo = function () {};

- `.getPlatformInfo` should return platform-specific information
- `.getPlatformInfo` must return a `CordovaPlatform` object that contains the description of the platform's file structure and other properties of the platform (Platform's directories/main file locations such as `config.xml`, `www`, etc.).

## CLI work flow integration

- CLI-based workflow supports single or multiple platforms that purely leverages the Platform Api
- Platform centered shell tools versus cross-platform Cordova CLI workflows
- For more information, see [Android guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html).