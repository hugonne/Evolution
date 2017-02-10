var evolutionApp = angular.module("evolutionApp");

evolutionApp.factory("DrawingEngine", function () {
    var factory = {};

    function getRandomColor() {
        var hexChars = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++) {
            color += hexChars[Math.floor(Math.random() * 16)];
        }
        return Number(color);
    }

    factory.lines = {
        drawLine: function (renderer, stage, x, y, degrees, referenceAngle, length, color) {
            var Graphics = PIXI.Graphics;
            var newAngle = (referenceAngle - degrees) % 360;
            var radians = newAngle * Math.PI / 180;

            //Calculate final position
            var xf = x + length * Math.cos(radians);
            var yf = y + length * Math.sin(radians);

            if (!color) {
                color = 0x000000;
            }

            var line = new Graphics();
            line.lineStyle(1, color, 1);
            line.moveTo(x, y);
            line.lineTo(xf, yf);
            stage.addChild(line);

            renderer.render(stage);

            return {
                xInitial: x,
                yInitial: y,
                xFinal: xf,
                yFinal: yf,
                length: length,
                degrees: newAngle
            };
        },
        drawChildren: function (
            renderer,
            stage,
            line,
            generations,
            totalGenerations,
            genes,
            lengthDelta,
            childrenAngle,
            anglesDelta) {

            if (generations > 0) {
                var color = getRandomColor();
                var index = totalGenerations - generations;
                //If no angle has been defined for current generation, do it according to delta
                if (!genes[index]) {
                    var delta = Math.floor(Math.random() * (anglesDelta + anglesDelta * 2 - 1)) - anglesDelta;
                    //childrenAngle += delta;
                    genes[index] = childrenAngle + delta;
                }

                generations--;

                var waitTime = 1;

                setTimeout(function () {
                    var child1 = factory.lines.drawLine(
                        renderer,
                        stage,
                        line.xFinal,
                        line.yFinal,
                        genes[index],
                        line.degrees,
                        line.length - lengthDelta,
                        color);
                    factory.lines.drawChildren(
                        renderer,
                        stage,
                        child1,
                        generations,
                        totalGenerations,
                        genes,
                        lengthDelta,
                        childrenAngle,
                        anglesDelta);

                    setTimeout(function () {
                        var child2 = factory.lines.drawLine(
                            renderer,
                            stage,
                            line.xFinal,
                            line.yFinal, -genes[index],
                            line.degrees,
                            line.length - lengthDelta,
                            color);
                        factory.lines.drawChildren(
                            renderer,
                            stage,
                            child2,
                            generations,
                            totalGenerations,
                            genes,
                            lengthDelta,
                            childrenAngle,
                            anglesDelta);
                    }, waitTime);

                }, waitTime);
            }
        }
    };
    return factory;
});