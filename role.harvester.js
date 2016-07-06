var information = require('room.information');


//TODO: explore another room if there is nothing here

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep, fromFootman) {
        if(creep.memory.TimeToFullHarvest == 'undefined'){
            creep.memory.TimeToFullHarvest = 0;
        }
        creep.memory.TimeToFullHarvest++;
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            /**find the best source and harvest that**/
            if(sources.length == 0){
                
            }
            else{
                if(!(creep.memory.harvestIndex && creep.memory.harvestIndex != -1)){
                    creep.memory.harvestIndex = 0;
                    for(var i = 0; i < sources.length; i++){ 
                        if(information.getHarvestTime(sources[i].pos.x, sources[i].pos.y, creep) < information.getHarvestTime(sources[creep.memory.harvestIndex].pos.x, sources[creep.memory.harvestIndex].pos.y, creep)){
                            creep.memory.harvestIndex = i;
                        }
                    }
                }
                if(creep.harvest(sources[creep.memory.harvestIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.harvestIndex]);
                }else{
                    if(creep.memory.TimeToFullHarvest > 1){
                        information.logHarvestTime(creep.memory.TimeToFullHarvest,sources[creep.memory.harvestIndex].pos.x,sources[creep.memory.harvestIndex].pos.y, creep);
                    }
                }
            }
        }
        else {
            creep.memory.harvestIndex = -1;
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ) 
                                && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creep.memory.TimeToFullHarvest = 0;
                }
            }
        }
	}
};

module.exports = roleHarvester;