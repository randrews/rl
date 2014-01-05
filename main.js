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
            "floor_1": [0, 24],
            "floor_2": [24, 24],
            "floor_3": [48, 24],
            "floor_4": [72, 24],
            "floor_5": [96, 24],
            "floor_6": [120, 24],

	    // Walls
	    'wall_0': [216, 0],
	    'wall_1': [360, 0],
	    'wall_2': [240, 0],
	    'wall_3': [432, 0],
	    'wall_4': [312, 0],
	    'wall_5': [336, 0],
	    'wall_6': [384, 0],
	    'wall_7': [552, 0],
	    'wall_8': [288, 0],
	    'wall_9': [456, 0],
	    'wall_A': [264, 0],
	    'wall_B': [576, 0],
	    'wall_C': [408, 0],
	    'wall_D': [528, 0],
	    'wall_E': [504, 0],
	    'wall_F': [480, 0],

	    // Misc
            "door": [144, 24],
            "door_open": [168, 24],
            "@": [192, 24],
            " ": [216, 24],
            "": [216, 24]
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
	if(!v) return;

	var stack = [v];
	var entity = map.getEntity(x, y); if(entity) stack.push(entity.name);

	if(x == px && y == py) stack.push('@');
	display.draw(x-left, y-top, stack);
    });
};

Game.centerMap = function(display){
    var canvas = display.getContainer();
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style['margin-left'] = -(canvas.width/2) + "px";
};