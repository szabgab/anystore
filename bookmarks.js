angular.module('BookmarksApp', ['ngRoute'])
.config(function($logProvider){
    $logProvider.debugEnabled(true);
})
.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
       when('/', {
   	       templateUrl: 'main.html',
       }).
       when('/editor', {
           templateUrl: 'editor.html',
       }).
       otherwise({
           redirectTo: '/'
       });
}])
.controller('BookmarksController', function($scope, $log, $location) {
    var data = localStorage.getItem('bookmarks');
    if (data === null) {
        $scope.db = {
    		counter: 0,
    		bookmarks: [],
    	};
    } else {
        $scope.db = JSON.parse(data);
    }

    $scope.open_editor = function() {
        $log.debug('open_editor');
		$scope.editor = {};
        $location.path('/editor');
	};

	$scope.cancel = function() {
        $location.path('/');
	};
	$scope.save = function() {
		$log.debug('save');
		$log.debug($scope.editor.url);
		$scope.db.counter++;
		$scope.db.bookmarks.push({url: $scope.editor.url, id: $scope.db.counter});
		$log.debug($scope.db);
        localStorage.setItem("bookmarks", JSON.stringify($scope.db));
        $location.path('/');
	};
});
