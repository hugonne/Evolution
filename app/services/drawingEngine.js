var evolutionApp = angular.module("evolutionApp");

evolutionApp.factory("DrawingEngine", ["$q", "$timeout", function ($q, $timeout) {
    var factory = {};

    factory.utils = {
        getRandomColor: function () {
            var letters = 'BCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }
            return color;
        },
        randomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

    factory.lines = {
        drawLine: function (ctx, x, y, degrees, referenceAngle, length, color) {
            var newAngle = (referenceAngle - degrees) % 360;
            var radians = newAngle * Math.PI / 180;

            console.log("Drawing!");

            //Calculate final position
            x = Math.floor(x);
            y = Math.floor(y);
            var xf = Math.floor(x + length * Math.cos(radians));
            var yf = Math.floor(y + length * Math.sin(radians));

            if (!color) {
                color = "#fff";
            }

            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xf, yf);
            ctx.strokeStyle = color;
            ctx.stroke();

            return {
                xInitial: x,
                yInitial: y,
                xFinal: xf,
                yFinal: yf,
                length: length,
                degrees: newAngle
            };
        },
        drawChildren: function (ctx, line, lengthDelta, angleDelta) {
            var waitTime = 10;
            var color = factory.utils.getRandomColor();

            return $q(function (resolve, reject) {
                $timeout(function () {
                    var child1 = factory.lines.drawLine(
                        ctx,
                        line.xFinal,
                        line.yFinal,
                        angleDelta,
                        line.degrees,
                        line.length - lengthDelta,
                        color);
                    $timeout(function () {
                        var child2 = factory.lines.drawLine(
                            ctx,
                            line.xFinal,
                            line.yFinal,
                            -angleDelta,
                            line.degrees,
                            line.length - lengthDelta,
                            color);
                        resolve([child1, child2]);
                    }, waitTime);
                }, waitTime);
            });
        },
        drawManyChildern: function (ctx, line, generations, totalGenerations, genes, lengthDelta, childrenAngle, anglesDelta) {
            //alert(generations);
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

                var waitTime = 1000;

                setTimeout(function () {
                    var child1 = factory.lines.drawLine(
                        ctx,
                        line.xFinal,
                        line.yFinal,
                        genes[index],
                        line.degrees,
                        line.length - lengthDelta,
                        color);
                    factory.lines.drawManyChildern(
                        ctx,
                        child1,
                        generations,
                        totalGenerations,
                        genes,
                        lengthDelta,
                        childrenAngle,
                        anglesDelta);

                    setTimeout(function () {
                        var child2 = factory.lines.drawLine(
                            ctx,
                            line.xFinal,
                            line.yFinal,
                            -genes[index],
                            line.degrees,
                            line.length - lengthDelta,
                            color);
                        factory.lines.drawManyChildern(
                            ctx,
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
}]);