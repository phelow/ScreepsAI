//Train to harvest in other rooms
var roleHarvester = {
    chooseHarvestIndex: function(creep,slots){
        creep.memory.harvestIndex = 0;
        var y = 0;
        for(var s in slots[creep.room.name]){
            if(slots[creep.room.name][y] > slots[creep.room.name][creep.memory.harvestIndex]){
                creep.memory.harvestIndex = y;
            }
            y = y + 1;
        }
        
        if(slots[creep.room.name][creep.memory.harvestIndex] <= 0){
            creep.memory.harvestIndex = -1;
        }
    },
    
    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sources) {
        
        if(creep.memory.TimeToFullHarvest == 'undefined'){
            creep.memory.TimeToFullHarvest = 0;
        }
        if(creep.memory.harvesting == 'undefined'){
            creep.memory.harvesting = true;
        }
        
        
        if(!(creep.memory.harvestIndex && creep.memory.harvestIndex >-1 && sources.length > 0) || creep.memory.harvestIndex == -1){
            this.chooseHarvestIndex(creep,slots);
            
        }
        
        if(creep.memory.harvestIndex == -1){
            creep.moveTo(creep.pos.findClosestByRange(exitDir,FIND_EXIT_TOP));
        }
        slots[creep.room.name][creep.memory.harvestIndex] = slots[creep.room.name][creep.memory.harvestIndex]-1;
        
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }
        
	    if(creep.memory.harvesting) {
            /**find the best source and harvest that**/
            if(droppedEnergy.length > 0){
                
                if(creep.pickup(droppedEnergy[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[1]);
                }
                return slots;
            }
            
            if(sources.length > 0){
                if(creep.harvest(sources[creep.memory.harvestIndex]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[creep.memory.harvestIndex]);
                }
            }
        }
        else {
            
            
            creep.memory.harvestIndex = 0;
            var j = 0;
            this.chooseHarvestIndex(creep,slots);
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER ) 
                                && structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length == 0){
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ) 
                                    && structure.energy < structure.energyCapacity;
                        }
                });
            }
            
            if(targets.length == 0)
            {
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN) 
                                    && structure.energy < structure.energyCapacity;
                        }
                });
            }
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creep.memory.TimeToFullHarvest = 0;
                    
                    if(creep.carry.energy == 0){
                        creep.memory.harvestIndex = Math.round(Math.random() * (sources.length-1));
                        creep.memory.harvesting = true;
                        
                    }
                }
            }
        }
        return slots;
	}
};

module.exports = roleHarvester;