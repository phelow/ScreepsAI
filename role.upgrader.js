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
    run: function(creep) {
        timeToFullHarvest++;

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            
	        if(Game.spawns.Spawn1.energy == Game.spawns.Spawn1.energyCapacity){
	            if(creep.room.spawns[0].transferEnergy(creep) == ERR_NOT_IN_RANGE)
	            {
	                creep.moveTo(creep.room.spawns[0]);
	            }
	            return;
	        }
            roleHarvester.run(creep);
        }
	}
};

module.exports = roleUpgrader;