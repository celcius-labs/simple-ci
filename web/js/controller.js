var app = angular.module('Application', [ 'ngtimeago' ]);

function find_by_id (id, rows) {
  for (var i = 0; i < rows.length; i++) {
    if (id === rows[i].id) {
      return i;
    }
  }
}

app.controller('applicationController', function ($scope, $http, $location) {

  var id;

  if ($location.path()) {
    id = Number($location.path().substring(1));
  }

  $scope.get_last = function (count) {
    count = count || 25;

    $http.get('/api/v1/last').success(function (data) {
      $scope.results = data.rows;

      if (id === undefined || Number.isNaN(id)) {
        $scope.current = data.rows[0];
      } else {
        $scope.show_build(id);
      }
    });
  };

  $scope.show_build = function (id) {
    var found_id = find_by_id(id, $scope.results);

    if (found_id !== undefined) {
      $scope.current = $scope.results[found_id];
    } else {
      $http.get('/api/v1/result?id=' + id).success(function (data) {
        if (data && data.success) {
          $scope.current = data.row;
        }
      });
    }
  };

  $scope.get_last();
});
