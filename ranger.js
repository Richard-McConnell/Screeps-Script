 module.exports = function (spawn, ranger)
 {
            var captain = ranger.pos.findClosestByRange(FIND_MY_CREEPS,
            {filter: { memory: {role: 'captain'}}});
            var target;
            if (captain)
                target = Game.getObjectById(captain.memory.targetId);
            else
                target = ranger.pos.
                        findClosestByRange(FIND_HOSTILE_CREEPS);
            if (ranger.pos.isNearTo(target)) ranger.rangedAttack(target);
            else ranger.moveTo(target);
            
            if (target == undefined && captain != undefined)
                ranger.moveTo(captain);
            else if (target == undefined && captain == undefined)
                ranger.moveTo(spawn);
 }