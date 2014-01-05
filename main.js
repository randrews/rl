Game = {}

Game.init = function(){
    var w = 100, h=40;

    var tileSet = document.createElement("img");
    tileSet.src = "tiles.png";
    var deferred = jQuery.Deferred();
    tileSet.onload = function(){ deferred.resolve(); }

    this.display = new ROT.Display({
        width: 31, height: 17,
        layout: 'tile',
        bg: "000",
        tileWidth: 24,
        tileHeight: 24,
        tileSet: tileSet,
        tileMap: {
	    // Floors
            ".": [0, 24],
            ",": [24, 24],
            "`": [48, 24],
            "_": [72, 24],
            ";": [96, 24],
            "'": [120, 24],

	    // Walls
	    '0': [216, 0],
	    '1': [360, 0],
	    '2': [240, 0],
	    '3': [432, 0],
	    '4': [312, 0],
	    '5': [336, 0],
	    '6': [384, 0],
	    '7': [552, 0],
	    '8': [288, 0],
	    '9': [456, 0],
	    'A': [264, 0],
	    'B': [576, 0],
	    'C': [408, 0],
	    'D': [528, 0],
	    'E': [504, 0],
	    'F': [480, 0],

	    // Misc
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

    var that = this;
    deferred.done(function(){
	that.engine.start();
	that.draw();
    });
};

Game.draw = function(){
    var display = this.display;
    display.clear();
    var px = this.player.x, py = this.player.y;
    var left = px-15, top = py-8;
    this.map.eachRegion(left, top, 31, 17, function(map, x, y, v){
	if(v == '+')
	    display.draw(x-left, y-top, ['.', '+']);
	else
	    display.draw(x-left, y-top, v);
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