var evolutionApp = angular.module("evolutionApp", ["ngRoute"]);

evolutionApp.config(["$locationProvider", "$routeProvider",
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when("/canvas", {
                templateUrl: 'app/views/canvas.html'
            }).
            otherwise('/canvas');
    }
]);