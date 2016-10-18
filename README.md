ion-google-place-custom
=======================

Ionic directive for a location dropdown that utilizes google maps based on ion-autocomplete and ion-google-place with location biasing


This is a directive for an autocomplete overlay location field built for Ionic Framework as well as a place autocomplete querying the google place api.

This directive uses location biasing for better results.

#Installation

Installation should be dead simple, you can grab a copy from bower:
```bash
bower install ion-google-place-custom-bm
```

Or clone this repository.

For the geolocation service to work, you'll need to have Google Maps javascript API somewhere in your HEAD tag:
`<script src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>`

You'll need to add `ion-google-place` as a dependency on your Ionic app:
```javascript
angular.module('myApp', [
  'ionic',
  'ion-bm-place-tools'
]);
```

There are two kinds of usage:
* for regular addresses
* returns a google place autocomplete result
* binds the model to an address only
`<ion-custom-google-place-address placeholder="1234 Any St, City, State 55555" ng-model="someModel" location-changed="someFunction(location)"></ion-custom-google-place-address>`

* for Google Place lookups
* returns a google place autocomplete result
* binds the model to the a name like so 'establishmentName on Street in City, State'
* categories requires an array of google place types
`<ion-custom-google-place placeholder="Find a Place.." ng-model="someModel" location-changed="someFunction()" location-bias="coordinatesToBias" categories="['restaurant']"></ion-custom-google-place>`


the coordinatesToBias for location-bias should be a latlng object from google maps api