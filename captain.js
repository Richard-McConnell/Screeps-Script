 module.exports = function (captain)
 {
     if (captain.room.name == ' sim')
     {
        if (Game.time % 200 == 0)
        {
            var hundreds = Math.round(Game.time / 200);
            console.log(hundreds + ' invasion');
            captain.say('It\'s ' + hundreds + ' invasion');
        }
     }
    var captainsAttack = 0;
    for (var item in captain.body)
        if (captain.body[item].type == ATTACK) captainsAttack++;
    
    var target = captain.findClosestHostileByRange();
    if (target)
    {
        captain.memory.targetId = target.id;
        if (captain.pos.isNearTo(target)) captain.attack(target);
        else captain.moveTo(target);
    }
    else
        captain.moveTo(Game.getObjectById(captain.memory.spawnId));
 }

 