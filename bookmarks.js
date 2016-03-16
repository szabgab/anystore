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

    $scope.open_editor = function(idx) {
        $log.debug('open_editor for', idx);
        if (idx === null || idx === undefined) {
            $scope.editor = {};
        } else {
            $scope.editor = angular.copy($scope.db.bookmarks[idx]);
            $scope.editor.tags_string = ($scope.editor.tags || []).join(', ');
            $scope.editor.idx = idx;
        }
        $location.path('/editor');
	};

    $scope.delete = function(idx) {
        $scope.db.bookmarks.splice(idx, 1);
        save_in_db();
    }

	$scope.cancel = function() {
        $location.path('/');
	};
	$scope.save = function() {
		$log.debug('save');
		$log.debug($scope.editor);
        if ($scope.editor.hasOwnProperty('idx') ) {
            var idx = $scope.editor.idx;
            delete $scope.editor.idx;
            $scope.editor.tags = $scope.editor.tags_string.split(/\s*,\s*/);
            $scope.db.bookmarks[idx] = angular.copy($scope.editor);
        } else {
            $scope.db.counter++;
            $scope.editor.id = $scope.db.counter;
            $scope.editor.create_date = new Date();
    		$scope.db.bookmarks.push(angular.copy($scope.editor));
        }
		$log.debug($scope.db);
        save_in_db();
        $location.path('/');
	};
    $scope.export_data = function() {
        $log.debug('export_data');
        var data = JSON.stringify($scope.db);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/json;charset=utf-8,' + encodeURI(data);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'bookmarks.json';
        hiddenElement.click();
    };
    var save_in_db = function() {
        localStorage.setItem("bookmarks", JSON.stringify($scope.db));
    }
});
