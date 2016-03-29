 module.exports = function (warehouse, builder)
 {
    if (builder.carry.energy == 0)
    {
        if (builder.pos.isNearTo(warehouse) && 
        warehouse.energy == warehouse.energyCapacity)
            warehouse.transferEnergy(builder)
        else
            builder.moveTo(warehouse);
    }
    else
    {
        var target = builder.pos
            .findClosestByRange(FIND_CONSTRUCTION_SITES);
        var builderIsBusy = false;
        if (target)
        {
            if (builder.pos.isNearTo(target))
                {builder.build(target);}
            else {builder.moveTo(target);}
        }
        else
        {
            target = builder.pos.findClosestByRange(FIND_STRUCTURES,
               {filter: function(object) 
               {return object.hits < object.hitsMax}});
            if (builder.pos.isNearTo(target)) 
                builder.repair(target)
            else builder.moveTo(target);
        }
    }
}