Map = function(w, h, generator){
    this.cells = [];
    this.entities = [];
    this.w = w; this.h = h;
    this.player_start = null; // Coords of the player, [x, y]
    if(generator) this.init(generator);
};

Map.prototype.put = function(x, y, v){
    this.cells[x+y*this.w] = v;
    return this;
};

Map.prototype.get = function(x, y){
    return this.cells[x+y*this.w];
};

Map.prototype.putEntity = function(x, y, v){
    this.entities[x+y*this.w] = v;
    return this;
};

Map.prototype.getEntity = function(x, y){
    return this.entities[x+y*this.w];
};

Map.prototype.each = function(fn){
    for(var y=0; y < this.h; y++)
        for(var x=0; x < this.w; x++)
            fn(this, x, y, this.cells[x+y*this.w]);
};

Map.prototype.eachRegion = function(left, top, w, h, fn){
    for(var y=top; y < top+h; y++)
        for(var x=left; x < left+w; x++)
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
        // Turn all doors into door entities
        room.getDoors(function(x, y){
            that.putEntity(x, y, new Door());
            that.put(x, y, "floor_" + [1, 2, 3, 4, 5, 6].random());
        });
    });

    // Randomize floor spaces
    this.each(function(map, x, y, v){
        if(v == '.') map.put(x,y,"floor_" + [1, 2, 3, 4, 5, 6].random());
    });

    // Turn wall spaces into wall corners, etc
    var wallMap = new Map(this.w, this.h);
    this.each(function(map, x, y, v){
        if(v == '#'){
            var n = 0;
            if(that.get(x, y-1) == "#") n+=1;
            if(that.get(x+1, y) == "#") n+=2;
            if(that.get(x, y+1) == "#") n+=4;
            if(that.get(x-1, y) == "#") n+=8;

            var digits = ['0', '1', '2', '3',
                          '4', '5', '6', '7',
                          '8', '9', 'A', 'B',
                          'C', 'D', 'E', 'F'];
            wallMap.put(x,y,"wall_"+digits[n]);
        }
    });

    wallMap.each(function(map, x, y, v){
        if(v) that.put(x, y, v);
    });

    // Place the player in a random room
    var player_room = generator.getRooms().random();
    that.player_start = [player_room.getLeft()+1, player_room.getTop()+1];
};

Map.prototype.tryMove = function(x, y){
    var val = this.get(x, y);

    // Can't move into a wall
    if(val.match("^wall")) return false;

    // Can't walk into a solid entity, bump it instead
    var entity = this.getEntity(x, y);
    if(entity && entity.solid) {
        entity.bump();
        return false;
    }

    return true;
};