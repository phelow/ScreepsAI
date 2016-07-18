var information = require('room.information');
var roleHarvester = require('role.harvester');

var targetSource;
var timeToFullHarvest = 0;

var roleUpgrader = {
    sourceSelectionPoints: function(source,creep) {
        var steps = Math.sqrt(Math.pow(source.pos.x - creep.pos.x,2) + Math.pow(source.pos.y - creep.pos.y,2));
        
        return steps + information.getHarvestTime(source, creep.room);
    },
    /** @param {Creep} creep **/
    run: function(creep,slots,droppedEnergy,sourcesAll,pop,enemyStrctures,energyDropoffPoints,energyNeeded) {
        var result = Game.spawns.Spawn1.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
        if(pop < 5){
            return roleHarvester.run(creep, slots,droppedEnergy,sourcesAll,enemyStrctures,energyDropoffPoints,energyNeeded);
        }
        
        timeToFullHarvest++;
        
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading && typeof(creep.room.controller) != 'undefined' && creep.room.controller.my) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,enemyStrctures,energyDropoffPoints,energyNeeded);
        }
        return slots;
	}
};

module.exports = roleUpgrader;