Game = {}

Game.init = function(){
    var w = 100, h=40;

    var tileSet = document.createElement("img");
    tileSet.src = "tiles.png";

    this.display = new ROT.Display({
        width: 31, height: 17,
        layout: 'tile',
        bg: "000",
        tileWidth: 24,
        tileHeight: 24,
        tileSet: tileSet,
        tileMap: {
            ".": [0, 24],
            ",": [24, 24],
            "`": [48, 24],
            "_": [72, 24],
            ";": [96, 24],
            "'": [120, 24],

            "#": [0, 0],
            "+": [144, 24],
            "@": [192, 24],
            " ": [216, 24]
        }
    });

    $(".main-map")[0].appendChild(this.display.getContainer());
    //this.centerMap(this.display);

    var mapGenerator = new ROT.Map.Digger(w, h, {
        roomWidth: [5, 15],
        roomHeight: [5, 10]
    });
    this.map = new Map(w, h, mapGenerator);
    var player_start = this.map.player_start;
    this.player = new Player(player_start[0], player_start[1]);

    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();

    this.draw();
};

Game.draw = function(){
    var display = this.display;
    display.clear();
    var px = this.player.x, py = this.player.y;
    var left = px-15, top = py-8;
    this.map.eachRegion(left, top, 31, 17, function(map, x, y, v){
	display.draw(x-left, y-top, v);

        // switch(v){
	// case '.': display.draw(x-left, y-top, v); break;
	// case ',': display.draw(x-left, y-top, v); break;
	// case '_': display.draw(x-left, y-top, v); break;
	// case ';': display.draw(x-left, y-top, v); break;
	// case '`': display.draw(x-left, y-top, v); break;
        // case "'": display.draw(x-left, y-top, v); break;
        // case '#': display.draw(x-left, y-top, '#'); break;
        // case ' ': display.draw(x-left, y-top, ' '); break;
        // case '+': display.draw(x-left, y-top, '+'); break;
        // }
    });

    var under = this.map.get(px, py);
    display.draw(15, 8, [under, '@']);
};

Game.centerMap = function(display){
    var canvas = display.getContainer();
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style['margin-left'] = -(canvas.width/2) + "px";
};