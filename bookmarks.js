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
        $location.path('/');
	};
});
 
