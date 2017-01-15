/**
 * Created by dieffrei on 15/01/17.
 */
angular.module('myFirstChromeExtensionApp',['br.com.dieffrei.chromeForce'])
    .controller('MainCtrl', ['$scope', 'chromeBrowserService', 'chromeForceService', '$q', '$http',
        function($scope, chromeBrowserService, chromeForceService, $q, $http){

            $scope.myOrganization = '';
            $scope.isOnSalesforceDomain = false;
            $scope.isLoading = true;

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

                //detect if is salesforce domain
                chromeForceService.getIsOnSalesforceDomain().then(function(isSalesforce){
                    $scope.isOnSalesforceDomain = isSalesforce;

                    if (isSalesforce) {
                        getUserInfo();
                    } else {
                        $scope.isLoading = false;
                    }


                });

            },function(err){
                console.error(err);
                $scope.isLoading = false;
            });


            //call salesforce rest api to get organization info
            function getUserInfo(){
                var query = 'SELECT Id, Name FROM Organization';
                api.callRestApi('/query?q=' + query, 'GET')
                    .then(function(response){
                        $scope.isLoading = false;
                        $scope.myOrganization = response.data.records[0];
                        //set as badge the organization' first letter
                        chrome.browserAction.setBadgeText({text: $scope.myOrganization.Name[0]});
                    }, function(err){
                        $scope.isLoading = false;
                    })
            }

        }]);
