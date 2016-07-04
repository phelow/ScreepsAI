var information = require('room.information');


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
            if(creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                /**find the best source and harvest that**/
                
                var harvestIndex = 0;
                for(var i = 0; i < sources.length; i++){
                    if(this.sourceSelectionPoints(sources[i],creep) < this.sourceSelectionPoints(sources[harvestIndex],creep)){
                        harvestIndex = i;
                    }   
                
                }
                
                if(creep.harvest(sources[harvestIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[harvestIndex]);
                    targetSource = sources[harvestIndex]
                }
            }
        }
	}
};

module.exports = roleUpgrader;