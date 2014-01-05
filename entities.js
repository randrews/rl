function Entity(){
    this.name = "";
    this.solid = false;
};

Entity.prototype.bump = function(){};

////////////////////////////////////////

function Door(){
    this.name = 'door';
    this.solid = true;
};

Door.prototype = new Entity();
Door.prototype.constructor = Door;

Door.prototype.bump = function(){
    this.solid = false;
    this.name = "door_open";
};