Game = {}

Game.init = function(){
    this.display = new ROT.Display({width: 100, height: 40});
    document.body.appendChild(this.display.getContainer());

    var mapGenerator = new ROT.Map.Digger(100, 40, {
        roomWidth: [5, 15],
        roomHeight: [5, 10]
    });
    this.map = new Map(100, 40, mapGenerator);
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
};
