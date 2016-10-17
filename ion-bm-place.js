(function() {

    'use strict';

    angular.module('ion-bm-place-tools', []).directive('ionCustomGooglePlace', [
        '$ionicTemplateLoader',
        '$ionicPlatform',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        '$ionicPopover',
        function ($ionicTemplateLoader, $ionicPlatform, $q, $timeout, $rootScope, $document) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: template,
                replace: true,
                scope: {
                    searchQuery: '=ngModel',
                    dropDownActive: '=',
                    locationChanged: '&',
                    radius: '=?',
                    locationBias: '=?'
                },
                link: function (scope, element, attrs, ngModel) {
                    scope.dropDownActive = false;
                    scope.selected = false;

                    var service = new google.maps.places.AutocompleteService();
                    var searchEventTimeout = undefined;
                    var latLng = null;

                    if (scope.locationBias) {
                        latLng = new google.maps.LatLng(scope.locationBias.Lat, scope.locationBias.Long);
                    }else{
                        navigator.geolocation.getCurrentPosition(function (position) {
                            latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        });
                    }

                    var searchInputElement = angular.element(element.find('input'));

                    scope.selectLocation = function (location) {
                        scope.dropDownActive = false;
                        scope.selected = true;
                        //scope.ngModel = location.place_id;
                        var service2 = new google.maps.places.PlacesService(searchInputElement[0]);
                        var request = {placeId: location.place_id};
                        service2.getDetails(request, function (result, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                scope.searchQuery = {
                                    loc_id: result.place_id,
                                    name: result.name,
                                    viewname: location.description,
                                    location: {
                                        address: result.formatted_address,
                                        geo: {
                                            lat: result.geometry.location.lat(),
                                            long: result.geometry.location.lng()
                                        }
                                    },
                                    open: true
                                };
                                if (result.opening_hours) {
                                    scope.searchQuery.open = result.opening_hours.open_now
                                }
                                scope.$apply();
                                if (scope.locationChanged) {
                                    scope.locationChanged();
                                }
                            }
                        });


                    };
                    if (!scope.radius) {
                        scope.radius = 100;
                    }

                    scope.locations = []

                    scope.$watch('searchQuery', function (query) {
                        if (!query) {
                            query = '';
                        }
                        scope.dropDownActive = (query.length >= 2 && scope.locations.length && !scope.selected);
                        if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                        searchEventTimeout = $timeout(function () {
                            if (!query) return;
                            if (query.length < 2) {
                                scope.locations = [];
                                return;
                            }
                            ;

                            var req = {};
                            req.input = query;
                            if (latLng) {
                                req.location = latLng;
                                req.radius = scope.radius;
                                req.types = ['establishment'];
                                req.componentRestrictions = {country: 'us'};
                            }
                            service.getPlacePredictions(req, function (predictions, status) {
                                if (status == google.maps.places.PlacesServiceStatus.OK) {
                                    scope.locations = predictions;
                                    scope.$apply();
                                }
                            });
                        }, 50); // we're throttling the input by 50ms to be nice to google's API
                    });

                    var onClick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        scope.dropDownActive = true;
                        scope.selected = false;
                        scope.$digest();
                        searchInputElement[0].focus();
                        setTimeout(function () {
                            searchInputElement[0].focus();
                        }, 0);
                    };

                    var onCancel = function (e) {
                        setTimeout(function () {
                            scope.dropDownActive = false;
                            scope.$digest();
                        }, 200);
                    };

                    element.find('input').bind('click', onClick);
                    element.find('input').bind('blur', onCancel);
                    element.find('input').bind('touchend', onClick);


                    if (attrs.placeholder) {
                        element.find('input').attr('placeholder', attrs.placeholder);
                    }
                }
            };
        }
    ]).directive('ionCustomGooglePlaceAddress', [
        '$ionicTemplateLoader',
        '$ionicPlatform',
        '$q',
        '$timeout',
        '$rootScope',
        '$document',
        '$ionicPopover',
        function ($ionicTemplateLoader, $ionicPlatform, $q, $timeout, $rootScope, $document) {
            return {
                require: '?ngModel',
                restrict: 'E',
                template: templateAddress,
                replace: true,
                scope: {
                    searchQuery: '=ngModel',
                    locationChanged: '&',
                    radius: '=?'
                },
                link: function (scope, element, attrs, ngModel) {
                    scope.dropDownActive = false;

                    var service = new google.maps.places.AutocompleteService();
                    var searchEventTimeout = undefined;
                    var latLng = null;


                    navigator.geolocation.getCurrentPosition(function (position) {
                        latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    });

                    var searchInputElement = angular.element(element.find('input'));

                    scope.selectAddress = function (location) {
                        scope.dropDownActive = false;
                        scope.searchQuery = location.description;
                        if (scope.locationChanged) {
                            scope.locationChanged();
                        }
                    };
                    if (!scope.radius) {
                        scope.radius = 10000;
                    }

                    scope.locations = [];

                    scope.$watch('searchQuery', function (query) {
                        if (!query) {
                            query = '';
                        }
                        scope.dropDownActive = (query.length >= 3 && scope.locations.length);
                        if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                        searchEventTimeout = $timeout(function () {
                            if (!query) return;
                            if (query.length < 3) {
                                scope.locations = [];
                                return;
                            }
                            ;

                            var req = {};
                            req.input = query;
                            if (latLng) {
                                req.location = latLng;
                                req.radius = scope.radius;
                                req.types = ['address'];
                                req.componentRestrictions = {country: 'us'};
                            }
                            service.getPlacePredictions(req, function (predictions, status) {
                                if (status == google.maps.places.PlacesServiceStatus.OK) {
                                    scope.locations = predictions;
                                    console.log(scope.locations);
                                    scope.$apply();
                                }
                            });
                        }, 50); // we're throttling the input by 50ms to be nice to google's API
                    });

                    var onClick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        scope.dropDownActive = true;
                        scope.$digest();
                        searchInputElement[0].focus();
                        setTimeout(function () {
                            searchInputElement[0].focus();
                        }, 0);
                    };

                    var onCancel = function (e) {
                        setTimeout(function () {
                            scope.dropDownActive = false;
                            scope.$digest();
                        }, 200);
                    };

                    element.find('input').bind('click', onClick);
                    element.find('input').bind('blur', onCancel);
                    element.find('input').bind('touchend', onClick);


                    if (attrs.placeholder) {
                        element.find('input').attr('placeholder', attrs.placeholder);
                    }
                }
            };
        }
    ]).run(["$templateCache", function ($templateCache) {
        $templateCache.put("src/ionGooglePlaceTemplate.html", template);
        $templateCache.put("src1/ionGooglePlaceAddressTemplate.html", templateAddress);
    }]);

// Add flexibility to template directive
    var template =
        '<div class="item ion-place-tools-autocomplete">' +
        '<label class="item-input">' +
        '<i class="icon ion-search placeholder-icon"></i>' +
        '<input type="text" autocomplete="off" ng-model="searchQuery">' +
        '</label>' +
        '<img src="images/powered_by_google_on_white_hdpi.png"/>' +
        '<div class="ion-place-tools-autocomplete-dropdown" ng-if="dropDownActive">' +
        '<ion-list>' +
        '<ion-item ng-repeat="location in locations" ng-click="selectLocation(location)">' +
        '{{location.terms[0].value}}' + '<p>' + ' on ' + '{{location.terms[1].value}}' + ' in ' + '{{location.terms[2].value}}' + ',' + '{{location.terms[3].value}}' + '</p>' +
        '</ion-item>' +
        '</ion-list>' +
        '</div>' +
        '</div>';

// Add flexibility to template directive
    var templateAddress =
        '<div class="item ion-place-tools-autocomplete">' +
        '<input type="text" autocomplete="off" ng-model="searchQuery">' +
        '<img src="images/powered_by_google_on_white_hdpi.png"/>' +
        '<div class="ion-place-tools-autocomplete-dropdown" ng-if="dropDownActive">' +
        '<ion-list>' +
        '<ion-item ng-repeat="location in locations" ng-click="selectAddress(location)">' +
        '{{location.description}}' +
        '</ion-item>' +
        '</ion-list>' +
        '</div>' +
        '</div>';

})();