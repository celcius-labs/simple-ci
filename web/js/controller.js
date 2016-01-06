var app = angular.module('Application', [ 'ngtimeago' ]);

app.controller('applicationController', function ($scope, $http) {

  $scope.get_last = function (count) {
    count = count || 25;

    $http.get('/api/v1/last').success(function (data) {
      $scope.results = data.rows;

      $scope.current = data.rows[0];
      console.log(data.rows);
    });
  };

  $scope.get_last();
});
