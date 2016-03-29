
 module.exports = function (spawn, guard)
 {
            var captain = guard.pos.findClosestByRange(FIND_MY_CREEPS,
            {filter: { memory: {role: 'captain'}}});
            var target = Game.getObjectById(captain.memory.targetId);
            if (!target) target = guard.pos.
                        findClosestByRange(FIND_HOSTILE_CREEPS);
            if (guard.pos.isNearTo(target)) guard.rangedAttack(target);
            else guard.moveTo(target);
            
            if (target == undefined && captain != undefined)
                guard.moveTo(captain);
            else if (target == undefined && captain == undefined)
                guard.moveTo(spawn);
 }