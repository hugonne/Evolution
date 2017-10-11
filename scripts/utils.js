var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomFloat = function (min, max, decimalPlaces) {
    if (decimalPlaces) {
        return Math.round(Math.random() * (max - min) + min, decimalPlaces);
    }
    return Math.random() * (max - min) + min;
};

var randomBool = function () {
    return Math.random() > 0.5;
}

var collisionDetected = function (r1, r2) {
    //Use half the value of width and height so objects have to bump more
    //into each other to detect a collision.
    return !(r2.x > (r1.x + r1.width / 2) ||
        (r2.x + r2.width / 2) < r1.x ||
        r2.y > (r1.y + r1.height / 2) ||
        (r2.y + r2.height / 2) < r1.y);
}

var loadWorldData = function (callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var obj = JSON.parse(this.responseText);
            callback(obj);
        }
    };
    xmlhttp.open("GET", "/data/worldData.json", true);
    xmlhttp.send();
}

//var total = 1;
////First horizontally, then vertically
//for (var j = 0; j < 27; j++) {
//    for (var i = 0; i < 31; i++) {
//        var frame = '"c' + total + '":{';
//        frame += '"frame":{"x":' + (i * 130 + 1) + ',"y":' + (j * 130 + 1) + ',"w":130,"h":130 },';
//        frame += '"rotated":false,';
//        frame += '"trimmed":false,';
//        frame += '"spriteSourceSize":{"x":' + (i * 130 + 1) + ',"y":' + (j * 130 + 1) + ',"w":130,"h":130},';
//        frame += '"sourceSize":{"w":130,"h":130}';
//        frame += "},";

//        total++;
//        console.log(frame);
//    }
//}