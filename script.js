module.exports.loop = function () {
    var Worker = [MOVE, WORK, CARRY];
    var workerCount = 0;
    var workerLimit = 1;
    var masterCount = 0;
    var masterLimit = 2;
    var Ranger = [MOVE, RANGED_ATTACK, HEAL];
    var Guard = [MOVE, ATTACK, HEAL];
    var Scout = [MOVE, CLAIM, HEAL];
    var scoutCount = 0;
    var scoutLimit = 1;
    var Healer = [MOVE, HEAL, CLAIM];
    var Superguard = [MOVE, ATTACK, RANGED_ATTACK];
    
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
    
    // Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], 'Worker');
	// Your code goes here
	// var source;
	for(var i in Game.creeps)
	{
	    var creep = Game.creeps[i];
	    if( ((creep.body == worker) || creep.name.startsWith('Worker')) )
	    {
	        workerCount++;
	        var worker = creep;
	        var source = worker.pos.findClosestByRange(FIND_SOURCES);
	        if (worker.carry[RESOURCE_ENERGY] < 50)
	            worker.moveTo(source); 
	        if ( worker.carry[RESOURCE_ENERGY] < 50 && worker.pos.isNearTo(source))
	            worker.harvest(source);
	                //creep.harvest(source) === NOT_IN_RANGE )
	            //creep.moveTo(source);
	       if (!worker.pos.isNearTo(Game.spawns.Spawn1) &&
	            worker.carry[RESOURCE_ENERGY] === 50)
	       {
	           worker.moveTo(Game.spawns.Spawn1);
	       }
	       if (worker.pos.isNearTo(Game.spawns.Spawn1) && 
	           worker.carry[RESOURCE_ENERGY] === 50)
	        worker.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY);
	       
	       if(Game.spawns.Spawn1.energy === Game.spawns.energyCapacity)
	       {
	           var target = worker.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	           if(worker.pos.isNearTo(target)) worker.build(target)
	           else worker.moveTo(target);
	       }
	       
	    }
	    else
	    if((creep.body == worker) || creep.name.startsWith('Master') )
	    {
	        masterCount++;
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
	                //creep.harvest(source) === NOT_IN_RANGE )
	            //creep.moveTo(source);
	    }
	}
	
	if(Game.spawns.Spawn1.energy < 10)
	{
	    console.log('Spawn1 will be soon out of energy');
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
	
    if (workerCount < workerLimit )
    {
        Game.spawns.Spawn1.createCreep(Worker, 'Worker ' + getRandomName());
    }
    if (masterCount < masterLimit )
    {
        Game.spawns.Spawn1.createCreep(Worker, 'Master ' + getRandomName());
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
