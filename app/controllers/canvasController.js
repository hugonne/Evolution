var evolutionApp = angular.module("evolutionApp");

evolutionApp.controller("CanvasController", ["$scope", "DrawingEngine", canvasController]);

function canvasController($scope, drawingEngine) {
    //Aliases
    var Container = PIXI.Container,
        autoDetectRenderer = PIXI.autoDetectRenderer,
        Graphics = PIXI.Graphics;

    //Create a Pixi stage and renderer and add the renderer.view to the DOM
    var stage = new Container(),
        renderer = autoDetectRenderer(
            1200,
            900,
            { antialias: true, transparent: true, resolution: 1 });

    renderer.view.style.border = "1px solid black";

    //Tree's initial position in canvas

    document.body.appendChild(renderer.view);

    evolve();

    renderer.render(stage);

    function evolve() {
        //cleanCanvas();

        //Tree's initial position in canvas
        var x = 600;
        var y = 600;

        var generationsEntered = 10;
        var childrenAngle = 30;
        var anglesDelta = 30;
        var initialLength = 80;
        var lengthDelta = 6;

        var totalGenerations = generationsEntered;
        var genes = [];

        //Initial vertical line
        var line = drawingEngine.lines.drawLine(renderer, stage, x, y, 90, 0, initialLength);

        //Children generation
        drawingEngine.lines.drawChildren(
            renderer,
            stage,
            line,
            generationsEntered,
            totalGenerations,
            genes,
            lengthDelta,
            childrenAngle,
            anglesDelta);
    }
}