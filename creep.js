
 require('spawn');
 Creep.prototype.greet = function ()
 {
     this.say('Greetings');
 }
 
 Creep.prototype.registerName = function (names)
 {
    names.push(this.name);
 }
 
 Creep.initNames = function ()
 {
    Creep.names = [];
 }
 
 Creep.getRandomName = function (letter, names)
    {
        // divide last names by professions and hide profession from name
        var firstNames = ["Sherlock","Richard", "Tom", "Mary", "Simon",
                        "Elizabeth", "Thomas", "Margaret", "Fanny", 
                        "Jane", "Sophia", "Frank", "William", "Robert",
                        "Daniel", "Jeffrey", "Gary", "Danny", "Emma",
                        "Edward", "Michael", "William", "Keith", "Martin",
                        "Paul", "Timothy", "Sheran", "Angela", "Kelly",
                        "Adrian", "Clieve", "Pauline", "Kathleen", "Michelle",
                        "Lesley", "Alex", "Alexander", "Elijah",
                        "Constantine"];
        var lastNames = ["Booth", "Bowen", "Bowes", "Carter", "Cutler", 
                        "Davis", "Doel", "Eaves", "Ellis", "Goddard", 
                        "Harvey", "Hudson", "Holmes", "Bain", "Bennett",
                        "Beresford", "Lawrence", "Stevens", "Murray", 
                        "Shelton", "Green", "Davies", "Burley", 
                        "Brown", "McGuire", "McConnell", 
                        "Evans", "Potter", "Baggins", "Anderson", 
                        "Solo", "Sparrow", "Grey"];
       var unitName = {firstName: firstNames[Math.round(firstNames.length * Math.random())],
                lastName: lastNames[Math.round(lastNames.length * Math.random())]};
       var antiLoop = 0;         
       while(names != undefined && names
            .indexOf(unitName.firstName + " " + 
            letter + ". " + unitName.lastName) >= 0 || 
            unitName.firstName == undefined ||
            unitName.firstName == undefined)
       {
           if (antiLoop == 50)
           {
               unitName = {firstName: firstNames[Math.round(lastNames.length * Math.random())],
                lastName: lastNames[Math.round(lastNames.length * Math.random())] + 
                " " + (new Date()).toUTCString()};
           }
           else unitName = {firstName: firstNames[Math.round(lastNames.length * Math.random())],
                lastName: lastNames[Math.round(lastNames.length * Math.random())]};
           antiLoop++;
       }
       names.push(unitName);
       return unitName;
    }
    
    Creep.getMaximumBody = function (spawn, bodyPart, moves)
    {
        var body = [];
        var cost = []; cost[TOUGH] = 10;
        cost[MOVE] = 50; cost[WORK] = 100;
        cost[CARRY] = 50; cost[ATTACK] = 80;
        cost[RANGED_ATTACK] = 150;
        cost[HEAL] = 250; cost[CLAIM] = 600;
        var energy = spawn.getEnergyNearSpawn();
        for(var i = 1; i <= moves; i++) 
        { energy -= cost[MOVE]; body.unshift(MOVE);}
        while (energy >= cost[bodyPart])
        { 
            energy -= cost[bodyPart]; body.unshift(bodyPart);
        }
        while (energy >= 10)
        { energy -= cost[TOUGH]; body.unshift(TOUGH);}
        return body;
    }
    Creep.getMaximumBodyForArray = 
    function (spawn, bodyParts, moves)
    {
        var body = [];
        var cost = []; cost[TOUGH] = 10;
        cost[MOVE] = 50; cost[WORK] = 100;
        cost[CARRY] = 50; cost[ATTACK] = 80;
        cost[RANGED_ATTACK] = 150;
        cost[HEAL] = 250; cost[CLAIM] = 600;
        var energy = spawn.getEnergyNearSpawn();
        for(var i = 1; i <= moves; i++) 
        { energy -= cost[MOVE]; body.unshift(MOVE);}
        while (energy >= cost[bodyParts[0]])
        { 
            for (var index in bodyParts)
            {
                if(energy >= cost[bodyParts[index]])
                {
                    energy -= cost[bodyParts[index]]; 
                    body.unshift(bodyParts[index]);
                }
                else break;
            }
        }
        while (energy >= 10)
        { energy -= cost[TOUGH]; body.unshift(TOUGH);}
        return body;
    }
    Creep.prototype.findClosestHostileByRange = function ()
    {
        var attackStats = 0;
        for (var item in this.body)
            if (this.body[item].type == ATTACK ||
            this.body[item].type == RANGED_ATTACK) attackStats++;
        return this.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
        {filter: function (hostile) 
        {
            var hostileAttack = 0;
            if (hostile != undefined)
            {
                for (var item in hostile.body)
                { 
                    if (hostile.body[item].type == ATTACK ||
                    hostile.body[item].type == RANGED_ATTACK)
                        hostileAttack++;
                }
                if (attackStats >= hostileAttack)
                    return true;
            }
            return false;
        }});
    }