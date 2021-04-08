<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->

# cordova-test-platform

This repo contains the code for an [Apache Cordova](http://cordova.apache.org)
platform that allows you to build applications that target NOTHING. This
platform is purely for testing, although it is also a good resource to see the
minimum requirements to implement a new platform.

## Background

This repository contains a reference implementation of Cordova's "Platform API". The Platform API defines interfaces for Cordova tooling to be able to create, build/compile, run/emulate and clean Cordova projects targeted at a specific platform. Core Cordova platforms such as [`cordova-android`](https://github.com/apache/cordova-android) and [`cordova-ios`](https://github.com/apache/cordova-ios) implement this API. This API is then used by tools such as [`cordova-cli`](https://github.com/apache/cordova-cli) and [`cordova-lib`](https://github.com/apache/cordova-lib) when managing platform-specific actions in cross-platform Cordova projects.

You can read more about the requirements in [PlatformRequirements.md](PlatformRequirements.md) as well.

## Usage

To add this platform to a test project using Cordova CLI run:

```
cordova platform add https://github.com/apache/cordova-test-platform
```

## Further Reading

- [Apache Cordova Documentation](http://docs.cordova.io)
- Historical
    - https://github.com/cordova/cordova-discuss/pull/9
    - https://github.com/cordova/cordova-discuss/pull/12
