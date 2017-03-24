var evolutionApp = angular.module("evolutionApp");

evolutionApp.controller("HomeController", ["$scope", "DrawingEngine", canvasController]);

function canvasController($scope, drawingEngine) {
    var xOffset = 0.85;
    var yOffset = 0.85;
    $scope.width = Math.round(document.body.clientWidth * xOffset);
    $scope.height = Math.round(document.body.clientHeight * yOffset);
    console.log($scope);
}