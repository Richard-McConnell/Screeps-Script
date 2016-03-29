
Spawn.prototype.hasFreeCapacity =
function ()
{
    if (this.energyCapacity == this.energy)
        return false
    else return true;
}

Spawn.prototype.createConstructionSites = function (path, constructionSite)
{
    for (var index in path)
    {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        if (this.room.lookForAt('structure', roomPosition).length == 0
        && this.room.lookForAt('constructionSite', roomPosition).length == 0)
            this.room.createConstructionSite(item.x, item.y, constructionSite);
    }
}

Spawn.prototype.createRoads = function()
{
    var source = this.pos.findClosestByRange(FIND_SOURCES);
    var roomController = this.pos.findClosestByRange(FIND_STRUCTURES,
    {filter: {structureType: STRUCTURE_CONTROLLER, room: this.room}});
    if (source && roomController)
    {
        var path = this.room.findPath(source.pos, roomController.pos, 
            {ignoreRoads: true, ignoreCreeps: true});
        this.createConstructionSites(path, STRUCTURE_ROAD);
    }
    if (source)
    {
        path = this.room.findPath(this.pos, source.pos, 
            {ignoreRoads: true, ignoreCreeps: true});
        this.createConstructionSites(path, STRUCTURE_ROAD);
    }
    if (roomController)
    {
        path = this.room.findPath(this.pos, roomController.pos, 
            {ignoreRoads: true, ignoreCreeps: true});
        this.createConstructionSites(path, STRUCTURE_ROAD);
    }
}

Spawn.prototype.createExtensions = function() // level
{
    var level = 1;
    var square = {
        topLeft: {x: this.pos.x - 1 * level, y: this.pos.y - 1 * level},
        topRight: {x: this.pos.x + 1 * level, y: this.pos.y - 1 * level},
        bottomRight: {x: this.pos.x + 1 * level, y: this.pos.y + 1 * level},
        bottomLeft: {x: this.pos.x - 1 * level, y: this.pos.y + 1 * level}};
    var roomPosTopLeft, roomPosTopRight,
        roomPosBottomRight, roomPosBottomLeft;
    var topPath, rightPath, bottomPath, leftPath;
    
    roomPosTopLeft = this.room.getPositionAt(square.topLeft.x, square.topLeft.y);
    roomPosTopRight = this.room.getPositionAt(square.topRight.x, square.topRight.y);
    roomPosBottomRight = this.room.getPositionAt(square.bottomRight.x, square.bottomRight.y);
    roomPosBottomLeft = this.room.getPositionAt(square.bottomLeft.x, square.bottomLeft.y);
    
    topPath = this.room.findPath(roomPosTopLeft, roomPosTopRight, {ignoreCreeps: true});
    rightPath = this.room.findPath(roomPosTopRight, roomPosBottomRight, {ignoreCreeps: true});
    bottomPath = this.room.findPath(roomPosBottomLeft, roomPosBottomRight, {ignoreCreeps: true});
    leftPath = this.room.findPath(roomPosTopLeft, roomPosBottomLeft, {ignoreCreeps: true});
    
    this.createConstructionSites(topPath, STRUCTURE_EXTENSION);
    this.createConstructionSites(rightPath, STRUCTURE_EXTENSION);
    this.createConstructionSites(bottomPath, STRUCTURE_EXTENSION);
    this.createConstructionSites(leftPath, STRUCTURE_EXTENSION);

    return undefined;
}

  Spawn.prototype.getEnergyNearSpawn  = function()
    {
        var energy = 0;
        var extensions = this.pos.findInRange(FIND_MY_STRUCTURES, 10, 
        function (object) 
        { return object.structureType == STRUCTURE_EXTENSION && 
            object.energy > 0});
        for (var item in extensions)
        {
            energy += extensions[item].energy || 0;
        }
        return energy;
    }
    Spawn.prototype.getEnergyCapacityNearSpawn  = function()
    {
        var energyCapacity = 0;
        var extensions = this.pos.findInRange(FIND_MY_STRUCTURES, 10, 
        function (object) 
        { return object.structureType == STRUCTURE_EXTENSION && 
            object.energyCapacity > 0});
        for (var item in extensions)
        {
            energyCapacity += extensions[item].energyCapacity || 0;
        }
        return energyCapacity;
    }

    Spawn.prototype.spawnUnits = function (limits, names)
    {
        if (this.getEnergyNearSpawn() /
                this.getEnergyCapacityNearSpawn() > 0.8 )
        {
            // here are should be unit counters of spawn
            if (this.memory.harvesterCount < limits.harvester && (
                this.memory.harvesterCount == 0 ||
                (this.memory.leaderCount + this.memory.healerCount
                + this.memory.rangerCount) >= 3 ))
            {
                var unitName = Creep.getRandomName('H', names);
                this.createCreep(
                    Creep.getMaximumBodyForArray(this, [CARRY, WORK], 2), 
                unitName.firstName + ' H. ' + unitName.lastName,
                {role: 'harvester', spawnId: this.id});
            }
            else if (this.memory.leaderCount < limits.captain)
            { // has a body of Guard and walking with letter of guard
                var unitName = Creep.getRandomName('L', names);
                var captain = this.createCreep(
                    Creep.getMaximumBody(this, ATTACK, 1), 
                unitName.firstName + ' L. ' + unitName.lastName,
                {role: 'captain', spawnId: this.id});
            }
            else if (this.memory.healerCount < limits.healer)
            {
                if (this.getEnergyNearSpawn() /
                    this.getEnergyCapacityNearSpawn() == 1)
                {
                    var unitName = Creep.getRandomName('D', names);
                    this.createCreep(Creep.getMaximumBody(this, HEAL, 1), 
                        unitName.firstName + ' D. ' + unitName.lastName,
                        {role: 'healer', spawnId: this.id});
                }
            }
            else if (this.memory.guardCount < limits.guard)
            { // has a body of Guard and walking with letter of guard
                var unitName = Creep.getRandomName('G', names);
                var captain = this.createCreep(
                    Creep.getMaximumBody(this, ATTACK, 1), 
                unitName.firstName + ' G. ' + unitName.lastName,
                {role: 'guard', spawnId: this.id});
            }
            else if (this.memory.masterCount < limits.master )
            {
                var unitName = Creep.getRandomName('M', names);
                this.createCreep(Creep.getMaximumBodyForArray(this, [CARRY, WORK], 1), 
                unitName.firstName + ' M. ' + unitName.lastName,
                {role: 'master', spawnId: this.id});
            }
            else if (this.memory.builderCount < limits.builder )
            {
                var unitName = Creep.getRandomName('B', names);
                this.createCreep(Creep.getMaximumBodyForArray(this, [CARRY, WORK], 1), 
                unitName.firstName + ' B. ' + unitName.lastName,
                {role: 'builder', spawnId: this.id});
            }
            else if (this.memory.rangerCount < limits.ranger )
            {
                var unitName = Creep.getRandomName('R', names);
                this.createCreep(Creep.getMaximumBody(this, RANGED_ATTACK, 1), 
                unitName.firstName + ' R. ' + unitName.lastName,
                {role: 'ranger', spawnId: this.id});
            }
        }
    }

