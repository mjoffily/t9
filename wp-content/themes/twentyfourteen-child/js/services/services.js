app.service('t9Service', ['$http', '$q', function($http, $q) {

  this.getDataFromLocalStorage = function() {
    var deferred = $q.defer();
    var result = {
      data: "no data"
    };

    if (localStorage.t9) {
      var o = localStorage.t9;
      result.data = JSON.parse(o);
    }

    deferred.resolve(result);
    return deferred.promise;
  };

  this.getDataFromServer = function(localStorageData) {
    var promise = $http.get(SiteParameters.theme_directory + '/js/mockdata.json')
      .success(function(response) {
        return response;
      });
    return promise;
  };

}]);