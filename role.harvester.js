var information = require('room.information');


var targetSource;
var timeToFullHarvest = 0;
    

var roleHarvester = {
    /** @param {Creep} creep **/
    sourceSelectionPoints: function(source,creep) {
        return information.getHarvestTime(source, creep.room);
    },
    run: function(creep, fromFootman) {
        //console.log("running harvester script" + fromFootman);
        timeToFullHarvest++;
	    if(creep.carry.energy <= creep.carryCapacity) {
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
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    timeToFullHarvest = 0;
                    creep.moveTo(targets[0]);
                    information.logHarvestTime(timeToFullHarvest,targetSource, creep.room);
                }
            }
        }
	}
};

module.exports = roleHarvester;