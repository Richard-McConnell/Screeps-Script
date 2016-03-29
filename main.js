// write code in multiple function modules in first lines
var harvester = require('harvester');
var master = require('master');
var builder = require('builder');
var leader = require('captain');
var ranger = require('ranger');
var healer = require('healer');
var guardian = require('guard');
require('creep');
require('spawn');
    function team(forSpawn)
    {
        this.name = getRandomTeamName(forSpawn);
        this.guard = undefined;
        this.ranger = undefined;
        this.healer = undefined;
    }
    function Task (spawn, roles, taskType)
    {
        var date = new Date();
        var random = Math.round(1000 * Math.random());
        this.id = date.toUTCString();
        /*this.spawnId = spawn.id;
        this.teamId = undefined;
        this.unitId = undefined;
        this.name = name;*/
    }

    var limits = {harvester: 2, master: 1, 
                builder: 1, ranger: 0,
                scout: 0, guard: 0,
                healer: 1, superguard: 1,
                captain: 1, team: 1};
    var teams = [];
    var names = [];
    
module.exports.loop = function () 
{
    //var task = new Task();
    //console.log(task.id);
    
    for (var index in Game.spawns)
    {
        var spawn = Game.spawns[index];
        if (spawn)
        {
            spawn.createRoads();
            //spawn.createExtensions();
            spawn.memory.harvesterCount = 0;
            spawn.memory.leaderCount = 0;
            spawn.memory.healerCount = 0;
            spawn.memory.guardCount = 0;
            spawn.memory.masterCount = 0;
            spawn.memory.builderCount = 0;
            spawn.memory.rangerCount = 0;
        }
    }
    
    for (var index in Game.creeps)
    {
        var unit = Game.creeps[index];
        unit.registerName(names);
        var spawn = unit.pos.findClosestByRange( FIND_MY_STRUCTURES,
        {filter: {structureType: STRUCTURE_SPAWN, room: unit.room}});
        if (spawn.energy/spawn.energyCapacity > 0.5 &&
            unit.ticksToLive <= 800)
            spawn.renewCreep(unit);
        var free_warehouse = warehouse = unit.pos
            .findClosestByRange(FIND_MY_STRUCTURES,
            {filter: function (object) 
            {return object.energy < object.energyCapacity &&
                object.room == unit.room && (
                object.structureType == STRUCTURE_SPAWN  ||
                object.structureType == STRUCTURE_EXTENSION)}});
        var warehouse = unit.pos
            .findClosestByRange(FIND_MY_STRUCTURES,
            {filter: function (object) 
            {return object.energy > 0 &&
                object.room == unit.room && (
                object.structureType == STRUCTURE_SPAWN ||
                object.structureType == STRUCTURE_EXTENSION)}});
        if (warehouse == undefined) warehouse = free_warehouse;
        
        if (unit.memory.role.startsWith('harvester'))
        { 
            Game.getObjectById(unit.memory.spawnId).memory.harvesterCount++;
            harvester(free_warehouse, unit);
        }
        else if (unit.memory.role == 'builder')
        {
            Game.getObjectById(unit.memory.spawnId).memory.builderCount++;
            builder(warehouse, unit);
        }
        else if (unit.memory.role == 'master')
        {
            Game.getObjectById(unit.memory.spawnId).memory.masterCount++;
            master(warehouse, unit);
        }
        else if(unit.memory.role == 'captain') 
        {
            Game.getObjectById(unit.memory.spawnId).memory.leaderCount++;
            leader(unit);
        }
        else if(unit.memory.role == 'ranger') 
        {
            Game.getObjectById(unit.memory.spawnId).memory.rangerCount++;
            ranger(spawn, unit);
        }
        else if(unit.memory.role == 'healer') 
        {
            Game.getObjectById(unit.memory.spawnId).memory.healerCount++;
            healer(spawn, unit);
        }
        else if(unit.memory.role == 'guard') 
        {
            Game.getObjectById(unit.memory.spawnId).memory.guardCount++;
            guardian(unit);
        }
    } // units loop 
    
    function getRandomTeamName(forSpawn)
    {
        var teamNames = ['Christmas Tree', 'Snowflake', 'Free Harvesters',
                        'Snowmen', 'Free Builders'];
        var teamName = teamNames[Math.round(teamNames.length * Math.random())]
                        + " of " + forSpawn.name;
        var antiLoop = 0;
        while (teams.find(
            function(object) {return object.name == teamName;}) != undefined )
        {
            if (antiLoop == 5)
            {
                return teamName = teamNames[Math.round(teamNames.length * Math.random())]
                        + " of " + forSpawn.name + (new Date()).toUTCString();
                
            }
            teamName = teamNames[Math.round(teamNames.length * Math.random())]
                        + " of " + forSpawn.name;
            antiLoop++;
        }
        return teamName;
    }
    // Spawn should have own units... It will be later
    var spawns = Game.rooms['sim'].find(FIND_MY_SPAWNS);
    for (var index in spawns)
    {
        spawns[index].spawnUnits(limits, names);
    }
}