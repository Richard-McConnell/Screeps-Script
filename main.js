module.exports.loop = function () {
    
    var Worker = [WORK, WORK, CARRY, MOVE];
    var Builder = [WORK, WORK, MOVE, CARRY];
    var Master = [WORK, CARRY, CARRY, MOVE];
    var limits = {worker: 1, master: 3, 
                builder: 1, ranger: 1,
                scout: 1, guard: 1,
                healer: 1, superguard: 1};
    var counters = {worker: 0, master: 0, 
                builder: 0, ranger: 0,
                scout: 0, guard: 0,
                healer: 0, superguard: 0};
    var Ranger = [MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL];
    var Guard = [MOVE, ATTACK, ATTACK, HEAL];
    var Scout = [MOVE, MOVE, CLAIM, HEAL];
    var Healer = [MOVE, HEAL, HEAL, CLAIM];
    var Superguard = [MOVE, ATTACK, ATTACK, RANGED_ATTACK];
    
    var buildingAUnit = false;
    
    var secretName = undefined;
    
    var NOT_IN_RANGE = ERR_NOT_IN_RANGE;
    
    if(Game.cpu.getUsed() >= Game.cpu.tickLimit)
    {
        Game.notify("CPU limit alert");
        console.log("Used maximum of CPU");
    }
    else if(Game.cpu.getUsed() >= Game.cpu.tickLimit / 2)
    {
        console.log("Used half of CPU");
    }
    
    var needRepair;
    for (var index in Game.structures)
    {
        var structure = Game.structures[index];
        if (structure.hits < structure.hitsMax)
        {
            needRepair = structure;
            break;
        }
    }    
    
    // Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], 'Worker');
	// Your code goes here
	// var source;
	for(var i in Game.creeps)
	{
	    var creep = Game.creeps[i];
	    var spawn = Game.spawns.Spawn1;
	    var noRoomInSpawn = spawn.energy == spawn.energyCapacity;
	    if (creep.name.startsWith('Worker'))
	    {
	        counters.worker++;
	        var worker = creep;
	        var source = worker.pos.findClosestByRange(FIND_SOURCES);
    	    if (worker.carry[RESOURCE_ENERGY] < worker.carryCapacity)
    	    {
    	        if (worker.pos.isNearTo(source)) worker.harvest(source)
    	        else worker.moveTo(source);
    	    } else if (worker.carry.energy === worker.carryCapacity && !noRoomInSpawn)
    	    {
    	        if (worker.pos.isNearTo(spawn)) worker.transfer(spawn, RESOURCE_ENERGY)
    	        else worker.moveTo(spawn);
    	    }
	       if(noRoomInSpawn && worker.carry.energy > 0)
	       {
	           var target = worker.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	           if(worker.pos.isNearTo(target)) worker.build(target)
	           else worker.moveTo(target);
	       }
	       
	    }
	    else 
	    if (creep.name.startsWith('Builder'))
	    {
	       counters.builder++;
	       var builder = creep;
	       if (builder.carry[RESOURCE_ENERGY] < builder.carryCapacity)
    	    {
    	        if (builder.pos.isNearTo(source)) builder.harvest(source)
    	        else builder.moveTo(source);
    	    } else if (builder.carry.energy === builder.carryCapacity && !noRoomInSpawn)
    	    {
    	        if (builder.pos.isNearTo(spawn)) builder.transfer(spawn, RESOURCE_ENERGY)
    	        else builder.moveTo(spawn);
    	    }
    	    var builderIsBusy = false;
	       if(noRoomInSpawn && builder.carry.energy > 0)
	       {
	           var target = builder.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	           if(builder.pos.isNearTo(target)) 
	           {builder.build(target); builderIsBusy = true;}
	           else builder.moveTo(target);
	       }
	       if(!builderIsBusy && noRoomInSpawn && builder.carry.energy > 0)
	       {
	           /*var target = builder.pos.findClosestByRange(FIND_STRUCTURES,
	           {filter: function() {return object.hits < object.hitsMax}});*/
	           if(builder.pos.isNearTo(needRepair)) builder.repair(needRepair)
	           else builder.moveTo(needRepair);
	       }
	       
	    }
	    else
	    if (creep.name.startsWith('Master'))
	    {
	        counters.master++;
	        var master = creep;
	        var source = master.pos.findClosestByRange(FIND_SOURCES);
	       var target = master.room.controller;
	       if (!master.pos.isNearTo(target) &&
	            master.carry[RESOURCE_ENERGY] === 50)
	       {
	           master.moveTo(target);
	       }
	       else if (master.pos.isNearTo(target) && 
	           master.carry[RESOURCE_ENERGY] > 0)
	        master.upgradeController(target);
	       if (master.carry[RESOURCE_ENERGY] === 0)
	            master.moveTo(source); 
	       if ( master.carry[RESOURCE_ENERGY] < 50 && master.pos.isNearTo(source))
	            master.harvest(source);
	    }
	}
	
	function getRandomName()
	{
	    var firstNames = ["Sherlock","Richard", "Tom", "Mary", "Elizabeth", 
	    "Thomas", "Margaret", "Fanny", "Jane", "Sophia", "Frank", "William", "Robert"];
	    var lastNames = ["Booth", "Bowen", "Bowes", "Carter", "Cutler", "Davis",
	            "Doel", "Eaves", "Ellis", "Goddard", "Harvey", "Hudson", "Holmes"];
	   return firstNames[Math.round(Math.random(firstNames.length))] + 
	   " " + lastNames[Math.round(Math.random(lastNames.length))];
	}
	
    if (counters.worker < limits.worker)
    {
        Game.spawns.Spawn1.createCreep(Worker, 'Worker ' + getRandomName());
    }
    else if (counters.master < limits.master )
    {
        Game.spawns.Spawn1.createCreep(Master, 'Master ' + getRandomName());
    }
    else if (counters.builder < limits.builder )
    {
        Game.spawns.Spawn1.createCreep(Builder, 'Builder ' + getRandomName());
    }
	
	ConstructionSite.prototype.showProgress =
	function ()
	{
	    var percent = Math.round(this.progress * 100 / this.progressTotal);
	    console.log('Construction progress of ' + this + ' is ' + percent + '%');
	};
	//if (creep.<action>(target) == ERR_NOT_IN_RANGE)
	//  creep.moveTo(target);

	// creep.notifyWhenAttacked(false);
	// Worker.pickup
	// Worker.repair
	// Ranger.rangedAttack
	// Ranger.rangedMassAttack
	// Healer.rangedHeal
	// var target = healer.pos.findClosestByRange(FIND_MY_CREEPS, 
	// { filter: function () {return object.hits < object.hitsMax}});
	// if (healer.pos.isNearTo(target))
	//    healer.heal(target);
	//   else if(healer.rangedHeal(target) == NOT_IN_RANGE)
	//    healer.moveTo(target);
	
}
