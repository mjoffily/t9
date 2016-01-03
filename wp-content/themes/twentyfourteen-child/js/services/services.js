/*global SiteParameters*/
/*global app*/

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

  this.getListOfFilesFromServer = function(user) {
    var obj = {};
    obj.user = user;
    var promise = $http({
      method: "post",
      url: SiteParameters.theme_directory + '/services/retrieve-file-list.php',
      data: obj,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return promise;
  };

  this.fileOpen = function(user, fileId) {
    var obj = {};
    obj.user = user;
    obj.id = fileId;
    var promise = $http({
      method: "post",
      url: SiteParameters.theme_directory + '/services/file-open.php',
      data: obj,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return promise;
  };

  this.fileSave = function(user, file) {
    var obj = {};
    obj.user = user;
    obj.id = file.id;
    obj.max_node_id = file.max_node_id;
    obj.file_name = file.file_name;
    obj.svg_height = file.svg_height;
    obj.svg_width = file.svg_width;
    obj.nodes = file.nodes;
    var promise = $http({
      method: "post",
      url: SiteParameters.theme_directory + '/services/file-save.php',
      data: obj,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return promise;
  };

}]);