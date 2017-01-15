/**
 * Created by dieffrei on 15/01/17.
 */
angular.module('myFirstChromeExtensionApp',['br.com.dieffrei.chromeForce'])
    .controller('MainCtrl', ['$scope', 'chromeBrowserService', 'chromeForceService', '$q', '$http',
        function($scope, chromeBrowserService, chromeForceService, $q, $http){

            $scope.appName = 'My first chrome extension';
            $scope.myOrganization = null;

            var api = null;

            chromeForceService.getSalesforceInfo().then(function(salesforceInfo){
                console.log('salesforce info', salesforceInfo);
                api = new ChromeForce.SalesforceApi({
                    sessionId: salesforceInfo.sessionId,
                    instanceName: salesforceInfo.instanceName,
                    $q: $q,
                    $http: $http
                });
            },function(err){
                console.err(err);
            });

            $scope.getUserInfo = function(){
                var query = 'SELECT Id, Name FROM Organization';
                api.callRestApi('/query?q=' + query, 'GET')
                    .then(function(response){
                        $scope.myOrganization = response.data.records[0];
                })
            }



        }]);
