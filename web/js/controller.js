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

  var paths = $location.absUrl().split('/');

  if (paths.length == 6 && paths[3] === 'repo') {
    $scope.username = paths[4];
    $scope.repository = paths[5];
  }

  $scope.get_last = function (count) {
    count = count || 25;

    var url = '/api/v1/last';

    if ($scope.username) {
      url += '?username=' + $scope.username + '&repository=' + $scope.repository;
    }

    $http.get(url).success(function (data) {
      for (var i = 0; i < data.rows.length; i++) {
        data.rows[i].started_read = new Date(data.rows[i].started_epoch).toString();
        data.rows[i].ended_read = new Date(data.rows[i].ended_epoch).toString();
        data.rows[i].duration = (data.rows[i].ended_epoch - data.rows[i].started_epoch) / 1000;
      }
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
          data.row.started_read = new Date(data.row.started_epoch).toString();
          data.row.ended_read = new Date(data.row.ended_epoch).toString();
          data.row.duration = (data.row.ended_epoch - data.row.started_epoch) / 1000;
          $scope.current = data.row;
        }
      });
    }
  };

  $scope.get_last();
});
