'use strict';

var app = angular.module('bikeShare', ['ngAnimate','ngRoute']);

app.controller('ChordController', function($scope, $http) {
	console.log('here');
	$scope.hi = "hello, world";

});
