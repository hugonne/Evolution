//////////////////////////////////////////////////////////////
//Variables (genes). These are the values to play around with.
//////////////////////////////////////////////////////////////
var generationsEntered;
var childrenAngle;
var initialLength;
var lengthDelta;
var useFabricJs;
//////////////////////////////////////////////////////////////

var anglesDelta = 20;
var totalGenerations = 0;

var canvas = new fabric.StaticCanvas('evolution');
var ctx = getContext();
var genes = [];

function evolve() {
    //Tree's initial position in canvas
    var x = 600;
    var y = 600;

    canvas.clear();

    generationsEntered = Number(document.getElementById("generations").value);
    childrenAngle = Number(document.getElementById("degrees").value);
    initialLength = Number(document.getElementById("initialLength").value);
    lengthDelta = Number(document.getElementById("lengthDelta").value);
    useFabricJs = Number(document.getElementById("useFabricJs").checked);

    //Initial vertical line
    var line = dibujarLinea(x, y, 90, 0, initialLength);

    totalGenerations = generationsEntered;
    genes = [];

    //Children generation
    drawChildren(line, generationsEntered);

    console.log(genes);
}

function getContext() {
    var canvas = document.getElementById("evolution");
    var ctx = canvas.getContext("2d");
    return ctx;
}

function cleanCanvas() {
    var canvas = document.getElementById("evolution");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomColor() {
    var hexChars = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += hexChars[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawChildren(line, generations) {
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

        var waitTime = 50;

        setTimeout(function() {
            var child1 = dibujarLinea(line.xFinal,
                line.yFinal,
                genes[index],
                line.degrees,
                line.length - lengthDelta,
                color);
            drawChildren(child1, generations); 

            setTimeout(function() {
                var child2 = dibujarLinea(line.xFinal,
                    line.yFinal,
                    -genes[index],
                    line.degrees,
                    line.length - lengthDelta,
                    color);
                drawChildren(child2, generations);
            }, waitTime);

        }, waitTime);
    }
}

function dibujarLinea(x, y, degrees, referenceAngle, length, color) {
    var newAngle = (referenceAngle - degrees) % 360;


    var radians = newAngle * Math.PI / 180;
    //Calculate final position
    var xf = x + length * Math.cos(radians);
    var yf = y + length * Math.sin(radians);

    if (!color) {
        color = "#000";
    }

    if (useFabricJs) {
        //Draw line with FabricJS
        var line = new window.fabric.Line([x, y, xf, yf], {
            //angle: newAngle,
            width: 5,
            stroke: color
        });
        canvas.add(line);
    } else {
        //Draw regular line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xf, yf);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    return {
        xInitial: x,
        yInitial: y,
        xFinal: xf,
        yFinal: yf,
        length: length,
        degrees: newAngle
    }
}