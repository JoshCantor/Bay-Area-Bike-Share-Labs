'use strict';

var app = angular.module('bikeShare', ['ngRoute', 'rzModule']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'mainTemplate.html',
			controller: 'MainController'
		})
		.when('/rides', {
			templateUrl: 'chordTemplate.html',
			controller: 'ChordController',
			resolve: {
				StationData: function($http){
					return $http.get('/data/stations')
				},
				ChordData: function($http){
					return $http.get('/data/chords');
				}
			}
		});
});

app.controller('MainController', function($scope, $location) {
	$scope.show = true;

	$scope.hideLanding = function() {
		$scope.show = false;
		$location.path('/rides');
	}
});


app.controller('ChordController', function($scope, StationData, ChordData) {
	var stations = StationData.data;
	var chordData = ChordData.data;

	var stationsObj = {};
	stations.forEach(function(station, i) {
		stationsObj[station.name] = i;
	});
	
	var matrix = [];
	for(var i = 0; i < stations.length; i++) {
		matrix[i] = [];
		for(var j = 0; j < stations.length; j++) {
			matrix[i][j] = 0;
		}
	}

	chordData.forEach(function(obj){
		if(obj.trip_start_hour === '6') {
		var startI = stationsObj[obj.start_station],
			endI = stationsObj[obj.end_station];

		matrix[startI][endI] += Number(obj.count);
	}
	});

	$scope.chordMatrix = matrix;
	$scope.stations = stations;

	$scope.slider = {
	  value: 5,
	  options: {
	    floor: 0,
	    ceil: 10,
	    showTicks: true
	  }
	};
});