Game = {}

Game.init = function(){
    this.display = new ROT.Display({width: 100, height: 40});
    document.body.appendChild(this.display.getContainer());

    var mapGenerator = new ROT.Map.Digger(100, 40, {
        roomWidth: [5, 15],
        roomHeight: [5, 10]
    });
    this.map = new Map(100, 40, mapGenerator);
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
    this.map.each(function(map, x, y, v){
        switch(v){
        case '.': display.draw(x, y, ' ', 'white', '550'); break;
        case '_': display.draw(x, y, ' ', 'white', '333'); break;
        case '#': display.draw(x, y, '#', '000', 'aaa'); break;
        case ' ': display.draw(x, y, ' ', 'white', '000'); break;
        case '+': display.draw(x, y, '+', 'f00', '550'); break;
        }
    });

    display.draw(this.player.x, this.player.y, '@', 'fff', '000');
};
