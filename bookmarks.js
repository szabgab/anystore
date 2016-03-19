angular.module('BookmarksApp', ['ngRoute'])
.config(function($logProvider){
    $logProvider.debugEnabled(true);
})
.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
       when('/', {
   	       templateUrl: 'main.html',
           controller: 'MainController'
       }).
       when('/switch', {
           templateUrl: 'switch.html',
           controller: 'SwitchController'
       }).
       when('/editor', {
           templateUrl: 'editor.html',
       }).
       when('/tag/:tag', {
           templateUrl: 'tag.html',
           controller: 'TagController'
       }).
       otherwise({
           redirectTo: '/'
       });
}])
.controller('BookmarksController', ['$scope', '$rootScope', '$log', '$location', function($scope, $rootScope, $log, $location) {

    var load_anystore = function() {
        var data = localStorage.getItem('anystore');
        if (data === null) {
            $scope.anystore = {
                apps: {
                        bookmarks: {
                            store: 'bookmarks'
                        }
                }
        	};
        } else {
            $scope.anystore = JSON.parse(data);
        }
        $scope.current_app = $scope.anystore.current_app;
    }

    $scope.save_anystore = function() {
        //$log.log('save_anystore current_scope:', $scope.anystore);
        $scope.current_app = $rootScope.current_app; // hmm, why do we need this?
        //$log.log('current_app:', $scope.current_app, $rootScope.current_app);
        $scope.anystore.current_app = $scope.current_app;
        localStorage.setItem('anystore', JSON.stringify($scope.anystore));
    }


    $scope.load_data = function() {
        $log.log('current_app', $scope.current_app);
        var data = localStorage.getItem($scope.anystore.apps[$scope.current_app].store);
        if (data === null) {
            $scope.db = {
        		counter: 0,
        		bookmarks: [],
        	};
        } else {
            $scope.db = JSON.parse(data);
        }
    }

    $scope.goto = function(url) {
        $location.path(url);
    };

    $scope.show_tag = function(tag) {
        $location.path('/tag/' + tag);
    };

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

        $scope.editor.tags = $scope.editor.tags_string.split(/\s*,\s*/);
        delete $scope.editor.tags_string;
        if ($scope.editor.hasOwnProperty('idx') ) {
            var idx = $scope.editor.idx;
            delete $scope.editor.idx;
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
        localStorage.setItem($scope.anystore.apps[$scope.current_app].store, JSON.stringify($scope.db));
    };

    load_anystore();
    $log.log('anystore:', $scope.anystore);
    if ($scope.current_app === undefined) {
        $location.path('/switch');

    } else {
        $scope.load_data();
    }

}])
.controller('SwitchController', ['$scope', '$rootScope', '$location', '$log', function($scope, $rootScope, $location, $log) {
    $rootScope.title = "Select application";
    $scope.new_current_app = $rootScope.current_app;

    $scope.switch_to = function() {
        // $log.log('current_app set to', $rootScope.current_app);
        // $log.log('current_app set to', $scope.current_app);
        // $log.log('new_current_app set to', $scope.new_current_app);
        $rootScope.current_app = $scope.new_current_app;
        // $log.log('current_app set to', $rootScope.current_app);
        // $log.log('current_app set to', $scope.current_app);
        // $log.log('new_current_app set to', $scope.new_current_app);
        $scope.save_anystore();
        $scope.load_data();
        $location.path('/');
    };
}])
.controller('MainController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $rootScope.title = "Bookmarks";
    $scope.bookmarks = $scope.db.bookmarks;
}])
.controller('TagController', ['$scope', '$rootScope', '$log', '$routeParams', '$filter', function($scope, $rootScope, $log, $routeParams, $filter) {
    $log.log('Tag', $routeParams);
    $rootScope.title = $routeParams.tag;
    $scope.bookmarks = $filter('filter')($scope.db.bookmarks, function(value, idx, arr) {
        var filtered_tags = (value.tags || []).filter(function(tag) {
            return tag === $routeParams.tag;
        });
        return filtered_tags.length > 0;
    });
    $scope.params = $routeParams;
}])
;
