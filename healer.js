 module.exports = function (spawn, healer)
 {
            var target = healer.pos.findClosestByRange(FIND_MY_CREEPS,
            {filter: function(unit) {return unit.hits < unit.hitsMax;}});
            if (target)
            {
                if (healer.pos.isNearTo(target)) healer.heal(target);
                else if (healer.pos.inRangeTo(target, 3)) healer.rangedHeal(target);
                else healer.moveTo(target);
            }
            var captain = healer.pos.findClosestByRange(FIND_MY_CREEPS,
            {filter: { memory: {role: 'captain'}}});
            if (target == undefined && captain != undefined)
                healer.moveTo(captain);
            else if (target == undefined && captain == undefined)
                healer.moveTo(spawn);
 }