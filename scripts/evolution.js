function loadWorldData(callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var obj = JSON.parse(this.responseText);
            callback(obj);
        }
    };
    xmlhttp.open("GET", "worldData.json", true);
    xmlhttp.send();
}

loadWorldData(function(response) {
    console.log(response);
});

var game = new Game(4);

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