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
	$scope.viewChords = function() {
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
	
	$scope.slider = {
	  value: 6,
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
		$scope.$emit('valueUpdate');
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
				chordServiceData.time = obj.trip_start_hour;
			}
		});
		
		$scope.chordServiceData = chordServiceData;
	}

	createMatrix($scope.slider.value);
	
	$scope.stations = stations;

	$scope.$on('valueUpdate', function(event, args) {
		var currTime = $scope.slider.value;
		if (currTime === 0) {
			$scope.time = "Rides from 12am-12:59am";
		} else if (currTime < 12) {
			$scope.time = "Rides from " + currTime + "am-" + currTime + ":59am";
		} else if (currTime === 12) {
			$scope.time = "Rides from " + (currTime) + "pm-" + (currTime) + ":59pm";
		} else {
			$scope.time = "Rides from " + (currTime - 12) + "pm-" + (currTime - 12) + ":59pm";
		}

	});
});