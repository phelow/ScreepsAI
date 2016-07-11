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
    run: function(creep,slots,droppedEnergy,sourcesAll,pop) {
        var result = Game.spawns.Spawn1.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
        if(pop < 5){
            return roleHarvester.run(creep, slots,droppedEnergy,sourcesAll);
        }
        
        timeToFullHarvest++;
        
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }
	    else{   
            if((creep.room.energyAvailable < creep.room.energyCapacityAvailable * .5) && creep.carry.energy == 0){
                return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll);
            }
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            if((creep.room.energyAvailable < creep.room.energyCapacityAvailable * .6)){
                return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll);
            }
	        creep.moveTo(Game.spawns.Spawn1);
        }
        return slots;
	}
};

module.exports = roleUpgrader;