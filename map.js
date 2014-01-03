Map = function(w, h, generator){
    this.cells = [];
    this.w = w; this.h = h;
    this.player_start = null; // Coords of the player, [x, y]
    this.init(generator);
};

Map.prototype.put = function(x, y, v){
    this.cells[x+y*this.w] = v;
    return this;
};

Map.prototype.get = function(x, y){
    return this.cells[x+y*this.w];
};

Map.prototype.each = function(fn){
    for(var y=0; y < this.h; y++)
        for(var x=0; x < this.w; x++)
            fn(this, x, y, this.cells[x+y*this.w]);
};

Map.prototype.inBounds = function(x, y){
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
};

// Returns a hash, like {n: '.', s: ' ', e: '#', ...}
Map.prototype.neighbors = function(x, y){
    var n = {};

    if(this.inBounds(x, y-1)) n.n = this.get(x, y-1);
    if(this.inBounds(x, y+1)) n.s = this.get(x, y+1);
    if(this.inBounds(x+1, y)) n.e = this.get(x+1, y);
    if(this.inBounds(x-1, y)) n.w = this.get(x-1, y);

    if(this.inBounds(x+1, y-1)) n.ne = this.get(x+1, y-1);
    if(this.inBounds(x+1, y+1)) n.se = this.get(x+1, y+1);
    if(this.inBounds(x-1, y-1)) n.nw = this.get(x-1, y-1);
    if(this.inBounds(x-1, y+1)) n.sw = this.get(x-1, y+1);

    return n;
};

// Returns a hash from cell type to array of directions (strings, 'n', 's', etc)
Map.prototype.neighborTypes = function(x, y, diag){
    var n = {};

    var add = function(val, dir){
        if(! n[val]) n[val] = [];
        n[val].push(dir);
    };

    if(this.inBounds(x, y-1)) add(this.get(x, y-1));
    if(this.inBounds(x, y+1)) add(this.get(x, y+1));
    if(this.inBounds(x+1, y)) add(this.get(x+1, y));
    if(this.inBounds(x-1, y)) add(this.get(x-1, y));

    if(diag){
        if(this.inBounds(x+1, y-1)) add(this.get(x+1, y-1));
        if(this.inBounds(x+1, y+1)) add(this.get(x+1, y+1));
        if(this.inBounds(x-1, y-1)) add(this.get(x-1, y-1));
        if(this.inBounds(x-1, y+1)) add(this.get(x-1, y+1));
    }

    return n;
};

// Use the generator to initialize the map
Map.prototype.init = function(generator){
    var that = this;

    // Copy walls / spaces to map
    generator.create(function(x, y, wall){
        if(wall)
            that.put(x, y, ' ');
        else
            that.put(x, y, '.');
    });

    // Surround empty space with walls
    this.each(function(map, x, y, v){
        var n = map.neighborTypes(x, y, true);
        if(v == ' ' && n['.']) map.put(x,y,'#');
        else map.put(x, y, v);
    });

    // Now we have dots for floor, hashes for walls, and
    // spaces for bare rock (between rooms).

    // Turn all room spaces into underscores
    generator.getRooms().forEach(function(room){
        for(var y=room.getTop(); y <= room.getBottom(); y++)
            for(var x=room.getLeft(); x <= room.getRight(); x++)
                that.put(x, y, '_');

        // Turn all doors into +
        room.getDoors(function(x, y){
            that.put(x, y, '+');
        });
    });

    // Place the player in a random room
    var player_room = generator.getRooms().random();
    that.player_start = [player_room.getLeft()+1, player_room.getTop()+1];
};