var evolutionApp = angular.module("evolutionApp");

evolutionApp.directive("evWorldCanvas",
    [
        "DrawingEngine", function() {
            return {
                restrict: "E",
                templateUrl: "app/directives/worldCanvasTemplate.html",
                scope: {
                    id: "=",
                    bg: "=",
                    width: "=",
                    height: "="
                }
            };
        }
    ]);