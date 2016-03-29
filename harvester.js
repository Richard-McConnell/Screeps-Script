
 module.exports = function (warehouse, harvester)
 {
        var source = harvester.pos.findClosestByRange(FIND_SOURCES);
        if (harvester.carry.energy < harvester.carryCapacity)
        {
            if (harvester.pos.isNearTo(source))
                harvester.harvest(source)
            else harvester.moveTo(source);
        } else {
            if (harvester.pos.isNearTo(warehouse))
                harvester.transfer(warehouse, RESOURCE_ENERGY)
            else harvester.moveTo(warehouse);
        }
}