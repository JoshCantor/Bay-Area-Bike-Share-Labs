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


app.controller('ChordController', function($scope, $rootScope, StationData, ChordData) {
	var stations = StationData.data;
	var chordData = ChordData.data;

	var stationsObj = {};
	stations.forEach(function(station, i) {
		stationsObj[station.name] = i;
	});
	
	$scope.slider = {
	  value: 0,
	  options: {
	    floor: 0,
	    ceil: 23,
	    showTicks: true
	  }
	};

	var chordServiceData = {
		matrix: [],
	};
	

	$scope.$watch('slider.value', function(newVal, oldVal) {
		createMatrix(newVal);
		$scope.$broadcast('matrixUpdate');
		
	});

	var createMatrix = function(value) { 
		for(var i = 0; i < stations.length; i++) {
			chordServiceData.matrix[i] = [];
			for(var j = 0; j < stations.length; j++) {
				chordServiceData.matrix[i][j] = 0;
			}
		}
		
		chordServiceData.totalTrips = 0;

		chordData.forEach(function(obj){
			if(obj.trip_start_hour === value.toString()) {
				var startI = stationsObj[obj.start_station],
					endI = stationsObj[obj.end_station];

				chordServiceData.matrix[startI][endI] += Number(obj.count);
				chordServiceData.totalTrips += Number(obj.count);
			}
		});
		
		$scope.chordServiceData = chordServiceData;
;	}

	createMatrix($scope.slider.value);
	
	$scope.stations = stations;

	
});