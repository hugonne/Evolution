var evolutionApp = angular.module("evolutionApp");

evolutionApp.controller("HomeController", ["$scope", "DrawingEngine", canvasController]);

function canvasController($scope, drawingEngine) {
    $scope.worldCanvasWidth = Math.round(document.getElementById("worldCanvasContainer").clientWidth * 0.9);
    $scope.worldCanvasHeight = Math.round(document.getElementById("worldCanvasContainer").clientHeight);
}