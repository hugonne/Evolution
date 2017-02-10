var evolutionApp = angular.module("evolutionApp");

evolutionApp.controller("CanvasController", ["$scope", "DrawingEngine", canvasController]);

function canvasController($scope, drawingEngine) {
    //Canvas setup
    var xOffset = 0.85;
    var yOffset = 0.85;
    var width = Math.round(document.body.clientWidth * xOffset);
    var height = Math.round(document.body.clientHeight * yOffset);
    var center = {
        x: Math.round(width / 2),
        y: Math.round(height / 2)
    };

    var scale = width / 1280;
    if (scale * 720 < height) {
        scale = height / 720;
    }

    //Aliases
    var Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        Graphics = PIXI.Graphics,
        Sprite = PIXI.Sprite,
        resources = PIXI.loader.resources,
        loader = PIXI.loader;

    //Create a Pixi stage and renderer and add the renderer.view to the DOM
    var stage = new Container(),
        renderer = autoDetectRenderer(
            width,
            height,
            { antialias: true, transparent: true, resolution: 1 });
    document.getElementById("canvasContainer").appendChild(renderer.view);

    loader.add("/img/background.jpg").load(setup);

    var childrenAngle = 30;
    var initialLength = 80;
    var lengthDelta = 6;
    var angleVariation = 90;
    $scope.generations = 1;
    var background;

    function setup() {
        background = new Sprite(resources["/img/background.jpg"].texture);
        //background.anchor.x = 0.5;
        //background.anchor.y = 0.5;
        //background.position.x = center.x;
        //background.position.y = center.y;
        background.width = Math.round(scale * 1280);
        background.height = Math.round(scale * 720);

        stage.addChild(background);
        renderer.render(stage);

        $scope.lastGenerationLines = [];

        //Initial vertical line
        $scope.lastGenerationLines.push(drawingEngine.lines.drawLine(
            renderer,
            stage,
            center.x,
            height * 2 / 3,
            90,
            0,
            initialLength));
    }

    $scope.evolve = function () {
        var parentLines = $scope.lastGenerationLines;

        $scope.lastGenerationLines = [];
        $scope.generations++;

        var angleDelta = drawingEngine.utils.randomInt(1, angleVariation);

        angular.forEach(parentLines, function (line, key) {
            drawingEngine.lines.drawChildren(renderer, stage, line, lengthDelta, angleDelta).then(function (data) {
                $scope.lastGenerationLines = $scope.lastGenerationLines.concat(data);
            });
        });
        //renderer.view.toDataURL();
    };

    $scope.clearCanvas = function () {
        stage.removeChildren();
        stage.addChild(background);
        renderer.render(stage);
        //Initial vertical line
        $scope.lastGenerationLines = [];
        $scope.generations = 1;
        $scope.lastGenerationLines.push(drawingEngine.lines.drawLine(
            renderer,
            stage,
            center.x,
            height * 2 / 3,
            90,
            0,
            initialLength));
    };
}