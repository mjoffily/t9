app.service('t9Service', ['$http', function($http) {

  this.getData = function() {
      var promise = $http.get(SiteParameters.theme_directory + '/js/mockdata.json')
        .success(function(response) {
            return response;
        });
        return promise;
  };
}]);