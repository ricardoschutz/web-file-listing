var app = angular.module('app', []);

// Interval for polling
app.constant({ 'REFRESH_TIMEOUT' : 5000 })

app.run(function($rootScope) {

	// Translatable texts
	$rootScope.text = {
		appTitle: "Downloads",
		files: "Arquivos",
		emptyFolder: "Pasta vazia"
	};

	// App's main color
	$rootScope.appColor = '#005c38';

	// Initial subfolder (inside ./files/)
	// Path is an array, so 'folder/subfolder/subsub/' would be ['folder','subfolder','subsub']
	$rootScope.path = [];

	// Cool feature to work with ;)
	angular.element(document.getElementById('styleVariables')).html(`:root {
		--color-main: ${$rootScope.appColor};
		--color-default: black;
	}`);
})

.controller('ListController', [
	'$scope', 
	'$http', 
	'$rootScope', 
	'$timeout', 
	'REFRESH_TIMEOUT', 
	function ListController(
		$scope, 
		$http, 
		$rootScope, 
		$timeout, 
		REFRESH_TIMEOUT) {

	// Array containing the items in current folder
	$scope.files = [];

	// Whether the page is loading
	$scope.loading = true;

	// A reference for the polling thread
	$scope.refresher = $timeout();

	// Use this to open a folder
	$scope.openFolder = function(folder) {
		$scope.loading = true;
		if (folder.name.lastIndexOf('/') == folder.name.length -1)
			path = folder.name.substring(0,path.length -1);
		$rootScope.path.push(folder.name);
		$scope.load($rootScope.path);
	}

	// Used by openFolder
	$scope.load = function(path) {
		$timeout.cancel($scope.refresher);
		var p = path.length > 0 ? path.join('/') : '';
		$http.get('list.py?path=/'+p).then(function(res) {
			$scope.files = res.data;
			$scope.loading = false;
		}).catch(function(e) { console.log(e); });
		$scope.startRefresher();
	}

	// Navigates back one level
	$scope.back = function() {
		$scope.loading = true;
		$rootScope.path.pop();
		$scope.load($rootScope.path);
	}

	$scope.hasParent = function(path) {
		return path.length > 0;
	}

	$scope.getParent = function(path) {
		if (path.length > 0) {
			return path.slice(0, path.length -2);
		} else return [];
	}

	// Starts the polling thread
	$scope.startRefresher = function() {
		$scope.refresher = $timeout(function() {
			$scope.load($rootScope.path);
			$scope.startRefresher();
		}, REFRESH_TIMEOUT);
	}

	// Loads the root folder (./files/)
	$scope.load([]);

}]);
