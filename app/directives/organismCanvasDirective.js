var evolutionApp = angular.module("evolutionApp");

evolutionApp.directive("evOrganismCanvas",
    [
        "DrawingEngine", function() {
            return {
                restrict: "E",
                templateUrl: "app/directives/organismCanvasTemplate.html",
                scope: {
                    id: "=",
                    bg: "=",
                    width: "=",
                    height: "="
                },
                controller: [
                    "$scope", "$timeout", "DrawingEngine", function($scope, $timeout, drawingEngine) {
                        var background;
                        var canvas;
                        var ctx;

                        //Init variables (genes)
                        var childrenAngle = 30;
                        var initialLength = 200;
                        var lengthDelta = 0.66;
                        var angleVariation = 100;
                        var angleDelta = 45;

                        //Canvas setup
                        //var xOffset = 0.85;
                        //var yOffset = 0.85;
                        //$scope.width = Math.round(document.body.clientWidth * xOffset);
                        //$scope.height = Math.round(document.body.clientHeight * yOffset);
                        var center = {
                            x: Math.round($scope.width / 2),
                            y: Math.round($scope.height / 2)
                        };
                        var scale = $scope.width / 1280;
                        if (scale * 720 < $scope.height) {
                            scale = $scope.height / 720;
                        }

                        var drawInitialLine = function() {
                            $scope.lastGenerationLines = [];
                            $scope.lastGenerationLines.push(drawingEngine.lines.drawLine(
                                ctx,
                                center.x,
                                $scope.height - 50,
                                90,
                                0,
                                initialLength));
                        };

                        var loadCanvas = function() {
                            //Canvas definition
                            canvas = document.getElementById($scope.id);
                            ctx = canvas.getContext("2d");

                            drawInitialLine();
                        };

                        //Scope initialization
                        $scope.generations = 1;
                        $scope.working = false;

                        //Scope functions
                        $scope.evolve = function() {
                            $scope.working = true;

                            var parentLines = $scope.lastGenerationLines;

                            $scope.lastGenerationLines = [];

                            //angleDelta = drawingEngine.utils.randomInt(1, angleVariation);

                            angular.forEach(parentLines,
                                function(line, key) {
                                    drawingEngine.lines
                                        .drawChildren(ctx, line, $scope.generations === 1 ? 1 : lengthDelta, angleDelta)
                                        .then(function(data) {
                                            $scope.lastGenerationLines = $scope.lastGenerationLines.concat(data);
                                            $scope.working = false;
                                        });
                                });
                            $scope.generations++;
                            //renderer.view.toDataURL();
                        };

                        $scope.clearCanvas = function() {
                            $scope.working = true;
                            $scope.generations = 1;

                            //Clear stage
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            //Initial vertical line
                            drawInitialLine();
                            $scope.working = false;
                        };

                        $timeout(loadCanvas, 0);
                    }
                ]
            };
        }
    ]);