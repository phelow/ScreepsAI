var roleHarvester = {
    chooseHarvestIndex: function(creep,slots){
        
        creep.memory.harvestIndex = 0;
        
        creep.memory.roomName = creep.room.name;
        
        var y = 0;
        for(var s in slots[creep.memory.roomName ]){
            if(slots[creep.memory.roomName ][y] > slots[creep.memory.roomName ][creep.memory.harvestIndex]){
                creep.memory.harvestIndex = y;
            }
            y = y + 1;
        }
        
        if(slots[creep.memory.roomName ][creep.memory.harvestIndex] <= 0){
            for(var s in slots.keys){
                for(var ss in slots[s].keys){
                    if(slots[s ][ss] > slots[creep.memory.roomName ][creep.memory.harvestIndex]){
                        creep.memory.harvestIndex = ss;
                        creep.memory.roomName = s;
                    }
                }
            }
        }
        
        if(slots[creep.memory.roomName ][creep.memory.harvestIndex] <= 0){
            creep.memory.harvestIndex = -1;
        }
        else{
            creep.memory.dir = -1;
        }
    },
    
    pickDirection: function(creep){
        creep.memory.samePos = 0;
        
        var exits = creep.room.find(FIND_EXIT);
        var numExits = 0;
        
        for(var e in exits){
            numExits++;
        }
        
        creep.memory.dir = Math.round(Math.random() * numExits);
        
    },
    
    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sources, roads, enemyStructures) 
    {
        if(creep.hits == creep.hitsMax){
            //if there are available structures to withdraw energy from do so
            //TODO: optimize
            withdrawIndex = -1;
            
            for(var w in enemyStructures){
                if(enemyStructures[w].energy > 0 && enemyStructures[w].owner.username != "keyboardkommander"){
                    withdrawIndex = w;
                }
                
            }
        }
        if(withdrawIndex > -1){
            if(creep.withdraw(enemyStructures[withdrawIndex], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            	creep.moveTo(enemyStructures[withdrawIndex]);    
            }
            return slots;
        }
        
        if(typeof(creep.memory.room) == 'undefined' ){
            creep.memory.room = creep.room.name;
        }
        
        if(creep.memory.room != creep.room.name){
            this.chooseHarvestIndex(creep,slots);
            this.pickDirection(creep);
            
        }
        creep.memory.room = creep.room.name;
        
        if(typeof(creep.memory.lastX) != 'undefined' && creep.memory.lastY == creep.pos.y && creep.memory.lastX == creep.pos.x && creep.memory.stuck >= 20){
            this.pickDirection(creep);
            this.chooseHarvestIndex(creep,slots)
            creep.memory.stuck = 0;
        }
        
        if(creep.memory.lastY == creep.pos.y && creep.memory.lastX == creep.pos.x){
            creep.memory.stuck = creep.memory.stuck + 1;
        }
        creep.memory.lastX = creep.pos.x;
        creep.memory.lastY = creep.pos.y;
        
        
        if(creep.memory.harvesting == 'undefined'){
            creep.memory.harvesting = true;
        }
        
        if(typeof(creep.memory.harvestIndex) == 'undefined' || creep.memory.harvestIndex < 0){
            this.chooseHarvestIndex(creep,slots);
        }
        
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }else if(creep.carry.energy == 0){
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.harvestIndex < 0 && creep.memory.harvesting){
            if(!creep.memory.lastPos == 'undefined'){
                creep.memory.lastPos = creep.pos;
            }
            creep.memory.lastPos = creep.pos;
            
            
            if(creep.moveTo(creep.room.find(FIND_EXIT)[creep.memory.dir]) != ERR_NOT_IN_RANGE){
                creep.memory.harvestIndex = -2;
                return slots;
            }
        }
        if(typeof(slots[creep.memory.roomName]) != 'undefined'){
            slots[creep.memory.roomName][creep.memory.harvestIndex] = slots[creep.memory.roomName][creep.memory.harvestIndex]-1;
        }
	    
	    if(creep.memory.harvesting) {
            /**find the best source and harvest that**/
            if(typeof(droppedEnergy) != 'undefined' && droppedEnergy.length > 0){
                
                if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0]);
                }
                return slots;
            }
            
            if(creep.memory.role == "harvester"){
                var result = creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
            }
            if(typeof(sources) != 'undefined' ){
                if(typeof(sources[creep.memory.roomName]) == 'undefined'){
                    this.chooseHarvestIndex(creep,slots);
                }
                
                if(creep.harvest(sources[creep.memory.roomName][creep.memory.harvestIndex]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[creep.memory.roomName][creep.memory.harvestIndex]);
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
            
            if(targets.length == 0)
            {
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN) 
                                    && structure.energy < structure.energyCapacity;
                        }
                });
            }
            
            if(targets.length == 0){
                targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ) 
                                    && structure.energy < structure.energyCapacity;
                        }
                });
            }
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                    creep.memory.TimeToFullHarvest = 0;
                    if(creep.memory.role == "harvester"){
                        var result = creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
                    }
                    return slots;
                    
                }
            }
            
            if(targets.length == 0){
                if(creep.memory.role == "harvester"){
                    var result = creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
                }
                if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns.Spawn1);
                }
            }
        }
        return slots;
	}
};

module.exports = roleHarvester;