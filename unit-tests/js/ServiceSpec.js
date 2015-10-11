/*global expect*/
/*global inject*/
/*global spyOn*/
/*global promise*/

var SiteParameters = {
    theme_directory: 'test'
};
var success = function (res) {
                return res.data;
              };

describe("t9Service", function() {
    var t9Service;
    var $q;
    var $httpBackend;
    var files;
    var result;

    beforeEach(module('t9'));
    
    beforeEach(inject(function($injector) {
            files = {"files":[{"id":"1","file_name":"my file name again"},{"id":"2","file_name":"my file name again"}]};
            result = {data: files};
            t9Service = $injector.get('t9Service');
            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.when('POST', 'test/services/retrieve-file-list.php').respond(files);
            $httpBackend.whenGET("test/js/partials/main-view.html").respond({ hello: 'World' });
            success = 
            spyOn(window, "success");
    }));

    afterEach(function() {
        $httpBackend.expectGET("test/js/partials/main-view.html");
    });
    
    it('can retrieve a list of files from the server when user is passed', function() {
        var promise = t9Service.getListOfFilesFromServer('mjoffily', window.success);
        expect(promise).toBeDefined();
        var count = 0;
        promise.then(function(res) {
            expect(res.data).toEqual(files);
            count = count + 1;
        });
        $httpBackend.flush();
        expect(window.success).toHaveBeenCalled();
        expect(window.success.calls.count()).toEqual(1);
        expect(count).toEqual(1);
    });

});
