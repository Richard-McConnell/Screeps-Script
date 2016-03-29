
 module.exports = function (warehouse, master)
 {
        
   var target = master.room.controller;
   if (master.carry[RESOURCE_ENERGY] == 0 && 
        !master.pos.isNearTo(warehouse))
        master.moveTo(warehouse);   
  else if ( master.carry[RESOURCE_ENERGY] < master.carryCapacity &&
        master.pos.isNearTo(warehouse))
        warehouse.transferEnergy(master);
   else if (!master.pos.isNearTo(target) &&
        master.carry[RESOURCE_ENERGY] == master.carryCapacity)
   {
       master.moveTo(target);
   }
   else if (master.pos.isNearTo(target) && 
       master.carry[RESOURCE_ENERGY] > 0)
    master.upgradeController(target);
  else if ( master.carry[RESOURCE_ENERGY] < master.carryCapacity && 
        !master.pos.isNearTo(target))
        master.moveTo(warehouse);
}