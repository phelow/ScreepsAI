var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep, slots) {
        console.log("Printing slots in harvester");
        console.log(slots);
        
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
        
        var sources = creep.room.find(FIND_SOURCES);
        
        if(!(creep.memory.harvestIndex && creep.memory.harvestIndex != -1 && sources.length > 0)){
            console.log(sources)
            creep.memory.harvestIndex = 0;
            var y = 0;
            for(var s in sources){
                console.log(s);
                if(slots[y] > slots[creep.memory.harvestIndex]){
                    console.log(slots[y] + ">" + slots[creep.memory.harvestIndex]);
                    creep.memory.harvestIndex = y;
                }
                y = y + 1;
                
            }
            
        }
        slots[creep.memory.harvestIndex] = slots[creep.memory.harvestIndex]-1;
        
        
        console.log("Printing slots in harvester after removing one slot for this harvester");
        console.log(slots);
        
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
            if(creep.memory.TimeToFullHarvest > 1){
            //    information.logHarvestTime(creep.memory.TimeToFullHarvest,sources[creep.memory.harvestIndex].pos.x,sources[creep.memory.harvestIndex].pos.y, creep);
            }
        }
        
        if(creep.memory.TimeToFullHarvest == 'undefined'){
            creep.memory.TimeToFullHarvest = 0;
        }
        if(creep.memory.harvesting == 'undefined'){
            creep.memory.harvesting = true;
        }
        creep.memory.TimeToFullHarvest++;
	    if(creep.memory.harvesting) {
            /**find the best source and harvest that**/
            if(droppedEnergy.length > 0){
                
                if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0]);
                }
                return;
            }
            
            if(sources.length == 0){
                
            }
            else{
                if(creep.harvest(sources[creep.memory.harvestIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.harvestIndex]);
                }
            }
        }
        else {
            creep.memory.harvestIndex = 0;
            var j = 0;
            for(var s in sources){
                if(slots[j] > slots[creep.memory.harvestIndex]){
                    creep.memory.harvestIndex = j;
                }
                j = j +1;
                slots[creep.memory.harvestIndex] = slots[creep.memory.harvestIndex]-1;
            }
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