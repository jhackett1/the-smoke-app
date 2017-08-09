Smoke Media App
========

This is a basic Cordova hybrid app for Smoke Media, based on AngularJS (1.0, soz).

It interacts with the website API at smoke.media/wp-json, and relies on custom keys and endpoints added to the API response by a Wordpress plugin running over there.

The app has basic functionality for:

* Reading articles
* Listening to live radio stream
* Seeing the radio schedule

Installation
-----------

The app requires Apache Cordova, so install that first. From the directory, you can then say

      cordova run android

To install a debug APK to a testing device with USB debugging enabled. You can also run it in a browser debugger by first adding the platform 'browser' to Cordova.

Wish list & known issues
---------

This app should be considered a proof of concept, not a finished product. It has only been tested on Android devices, but should theoretically work fine on iOS with a few UX tweaks.

Gestures like swipes are build from scratch in JS, so don't work exactly like native equivalents.

Ideally, the app would also benefit from:

* Deep links
* Push notifications
* Podcast downloads (via Audioboom API?)

A native makeover is also a worthy end goal.
