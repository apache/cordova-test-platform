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

[Apache Cordova](http://cordova.apache.org) is a project of [The Apache Software Foundation (ASF)](http://apache.org)

# How to Use This

This repository contains a reference implementation of Cordova's Platform API.
The Platform API defines interfaces for Cordova tooling to be able to create,
build/compile, run/emulate and clean Cordova projects targeted at a specific
platform. Core Cordova platforms such as cordova-android and cordova-ios
implement this API. This API is then used by tools such as cordova-cli and
cordova-lib when managing platform-specific actions in cross-platform Cordova
projects.

# Report Issues
Report them at the [Apache Cordova Issue Tracker](https://issues.apache.org/jira/browse/CB).

# Further Reading
- [Apache Cordova Documentation](http://docs.cordova.io)
- https://github.com/cordova/cordova-discuss/pull/9
- https://github.com/cordova/cordova-discuss/pull/12
