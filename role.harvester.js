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
    
    pickDirection: function(creep){
        var r = Math.random() * 100;
           
            creep.memory.dir = FIND_EXIT_RIGHT;
            if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                creep.memory.dir = FIND_EXIT_BOTTOM;
                
            }
            if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                creep.memory.dir = FIND_EXIT_LEFT;
                
            }
            if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                creep.memory.dir = FIND_EXIT_TOP;
                
            }
           
            
            if(r > 25){
                if(creep.pos.findClosestByRange(FIND_EXIT_BOTTOM)){
                    creep.memory.dir = FIND_EXIT_BOTTOM;
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_RIGHT;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_LEFT;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_TOP;
                        
                    }
                }
            }
            if(r > 50){
                if(creep.pos.findClosestByRange(FIND_EXIT_LEFT)){
                    creep.memory.dir = FIND_EXIT_LEFT;
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_RIGHT;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_BOTTOM;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_TOP;
                        
                    }
                }
            }
            if(r > 75){
                if(creep.pos.findClosestByRange(FIND_EXIT_TOP)){
                    creep.memory.dir = FIND_EXIT_TOP;
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_RIGHT;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_LEFT;
                        
                    }
                    if(creep.pos.findClosestByRange(creep.memory.dir) == null){
                        creep.memory.dir = FIND_EXIT_BOTTOM;
                        
                    }
                }
            }
        
    },
    
    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sources, roads) {
        if(roads){
            var result = Game.spawns.Spawn1.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
        }
        if(!creep.memory.dir){
            this.pickDirection(creep);   
        }
        
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
            if(creep.moveTo(creep.pos.findClosestByRange(creep.memory.dir)) != ERR_NOT_IN_RANGE){
                this.pickDirection(creep);
            }
        }
        slots[creep.room.name][creep.memory.harvestIndex] = slots[creep.room.name][creep.memory.harvestIndex]-1;
        
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }else if(creep.carry.energy == 0){
            creep.memory.harvesting = true;
                        
        }
        
	    if(creep.memory.harvesting) {
            /**find the best source and harvest that**/
            if(droppedEnergy.length > 0){
                
                if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0]);
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
                    
                }
            }
            
            if(targets.length == 0){
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
        return slots;
	}
};

module.exports = roleHarvester;