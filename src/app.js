/**
 * Created by dieffrei on 15/01/17.
 */
angular.module('myFirstChromeExtensionApp',['br.com.dieffrei.chromeForce'])
    .controller('MainCtrl', ['$scope', 'chromeBrowserService', 'chromeForceService', '$q', '$http',
        function($scope, chromeBrowserService, chromeForceService, $q, $http){

            $scope.myOrganization = null;
            $scope.isOnSalesforceDomain = false;

            var api = null;

            //getting salesforce session info
            chromeForceService.getSalesforceInfo().then(function(salesforceInfo){
                console.log('salesforce info', salesforceInfo);
                api = new ChromeForce.SalesforceApi({
                    sessionId: salesforceInfo.sessionId,
                    instanceName: salesforceInfo.instanceName,
                    $q: $q,
                    $http: $http
                });
            },function(err){
                console.error(err);
            });

            //detect if is salesforce domain
            chromeForceService.getIsOnSalesforceDomain().then(function(isSalesforce){
                $scope.isOnSalesforceDomain = isSalesforce;
            });

            //call salesforce rest api to get organization info
            $scope.getUserInfo = function(){
                var query = 'SELECT Id, Name FROM Organization';
                api.callRestApi('/query?q=' + query, 'GET')
                    .then(function(response){
                        $scope.myOrganization = response.data.records[0];
                })
            }

        }]);
