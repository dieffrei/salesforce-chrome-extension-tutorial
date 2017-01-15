# salesforce-chrome-extension-tutorial

#preview

# View
```html
<!DOCTYPE html>
<html ng-app="myFirstChromeExtensionApp">
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <link href="bower_components/salesforce-lightning-design-system/assets/styles/salesforce-lightning-design-system.min.css" rel="stylesheet" type="text/css"/>
    <link href="assets/css/custom.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="bower_components/underscore/underscore-min.js"></script>
    <script type="text/javascript" src="bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="bower_components/chrome-force/dist/chrome-force.js"></script>
    <script type="text/javascript" src="src/app.js"></script>
</head>
<body>

<div ng-controller="MainCtrl as ctrl" class="app-container">
    <div class="slds-page-header">
        <div class="slds-grid">
            <div class="slds-col slds-has-flexi-truncate">
                <div class="slds-media slds-no-space slds-grow">
                    <div class="slds-media__figure">
                        <svg class="slds-icon slds-icon-action-canvas" aria-hidden="true">
                            <use xlink:href="bower_components/salesforce-lightning-design-system/assets/icons/standard-sprite/svg/symbols.svg#canvas"></use>
                        </svg>
                    </div>
                    <div class="slds-media__body">
                        <p class="slds-text-title--caps slds-line-height--reset">dieffrei.com</p>
                        <h1 class="slds-page-header__title slds-m-right--small slds-align-middle slds-truncate" title="this should match the Record Title">My first chrome extension</h1>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <div class="app-section slds-is-relative">

        <div ng-if="isLoading" class="slds-spinner_container">
            <div role="status" class="slds-spinner slds-spinner--medium slds-spinner--brand">
                <span class="slds-assistive-text">Loading</span>
                <div class="slds-spinner__dot-a"></div>
                <div class="slds-spinner__dot-b"></div>
            </div>
        </div>

        <div ng-if="!isOnSalesforceDomain" class="slds-grid slds-grid--vertical-align-center slds-grid--align-center">
            <div class="slds-box slds-theme--shade slds-theme--alert-texture">
                <p class="slds-text-align--center">Current tab is not on <b>salesforce.com</b> domain.</p>
            </div>
        </div>

        <div ng-if="isOnSalesforceDomain" >
            <pre>{{myOrganization | json}}</pre>
        </div>

    </div>



</div>


</body>
</html>
```

# Controller
```html
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


```
