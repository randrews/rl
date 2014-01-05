Player = function(x, y){
    this.x = x;
    this.y = y;
    this.init();
};

Player.prototype.init = function(){
};

Player.prototype.act = function(){
    Game.engine.lock();
    window.addEventListener("keydown", this);
};

// Called by the window
Player.prototype.handleEvent = function(e) {
    // Map from keycode to index in rot.dirs[4]
    var keys = {}
    keys[ROT.VK_UP] = 0;
    keys[ROT.VK_RIGHT] = 1;
    keys[ROT.VK_DOWN] = 2;
    keys[ROT.VK_LEFT] = 3;
    var dir = keys[e.keyCode];

    if(dir || dir == 0){
        var delta = ROT.DIRS[4][dir]; // A two-element array of [dx, dy]
        this.x += delta[0];
        this.y += delta[1];
        Game.draw();
        Game.engine.unlock();
        return e.preventDefault();
    }
}