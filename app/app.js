var evolutionApp = angular.module("evolutionApp", ["ngRoute"]);

evolutionApp.config(["$locationProvider", "$routeProvider",
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when("/home", {
                templateUrl: 'app/views/home.html'
            }).
            otherwise('/home');
    }
]);