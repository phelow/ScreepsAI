//TODO: keep track of how much energy is being delivered to each structure, do not deliver more than that amount
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
    
    //Pick the closes
    //TODO: make sure energy is getting decremented
    chooseReturnIndex: function(creep, energyDropOff, energyNeeded){
        var CurDropOff = -1;
        var x = -1;
        var y = -1;
        for(var i in energyDropOff){
            //TODO: fix this so we don't need the workaround
            if(energyDropOff.length > 0 && typeof(energyNeeded) != 'undefined' && energyNeeded.length > 0){
                for(var j in energyDropOff[i]){
                    
                    if(energyNeeded[i][j] > CurDropOff){
                        CurDropOff = energyNeeded[i][j];
                        x = i;
                        y = j;
                    }
                }
            }
        }
        
        if(x != -1 && y != -1){
            var energyWithdrawn = Math.min(_.sum(creep.carry),energyNeeded[x][y]);
            energyNeeded[x][y] -= energyWithdrawn;
            
        
            return energyDropOff[x][y];
        }
        else{
            return null;   
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
        
        if(typeof(Memory[creep.room.name+ " " + creep.memory.dir]) == 'undefined'){
            Memory[creep.room.name+ " " + creep.memory.dir] = true;
        }
        
        for(var i = 0; i < 10 && false == Memory[creep.room.name+ " " + creep.memory.dir]; i++){
            creep.memory.dir = Math.round(Math.random() * numExits);
        }
        creep.memory.lastRoomCalculated = ""+ creep.room.name;
        
    },
    
    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sources, roads, enemyStructures,energyDropoffPoints,energyNeeded) 
    {
        if(typeof(droppedEnergy) != 'undefined' && droppedEnergy.length > 0 && creep.carry.energy != creep.carryCapacity){
            
            if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
            return slots;
        }
        
        /*
        var withdrawIndex = -1;
        if(creep.hits == creep.hitsMax && creep.energy == 0){
            //if there are available structures to withdraw energy from do so
            //TODO: optimize
            withdrawIndex = -1;
            
            for(var w in enemyStructures){
                if(enemyStructures[w].energy > 0 && enemyStructures[w].owner.username != "keyboardkommander"){
                    withdrawIndex = w;
                }
                
            }
        }
        if(withdrawIndex > -1 && creep.energy <= creep.carryCapacity){
            if(creep.withdraw(enemyStructures[withdrawIndex], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            	creep.moveTo(enemyStructures[withdrawIndex]);    
            }
            
            return slots;
        }*/
        
        if(typeof(creep.memory.room) == 'undefined' ){
            creep.memory.room = creep.room.name;
        }
        
        if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }else if(creep.carry.energy == 0){
            creep.memory.harvesting = true;
        }
        
        if(creep.memory.room != creep.room.name){
            var lastRoom = creep.memory.lastRoomCalculated;
            var lastDir = creep.memory.dir;
            this.chooseHarvestIndex(creep,slots);
            this.pickDirection(creep);
            if(creep.memory.harvestIndex == -1){
                Memory[lastRoom + " " + lastDir] = false;
            }else{
                Memory[lastRoom + " " + lastDir] = true;
            }
        }
        creep.memory.room = creep.room.name;
        
        if(typeof(creep.memory.lastX) != 'undefined' && creep.memory.lastY == creep.pos.y && creep.memory.lastX == creep.pos.x && creep.memory.stuck >= 20){
            this.pickDirection(creep);
            this.chooseHarvestIndex(creep,slots);
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
	    
	    if(creep.carry.energy == creep.carryCapacity){
            creep.memory.harvesting = false;
        }else if(creep.carry.energy == 0){
            creep.memory.harvesting = true;
        }
	    
	    if(creep.memory.harvesting == true) {
            /**find the best source and harvest that**/
            
            if(typeof(Memory[creep.room.name + " " + creep.pos.x + " " + creep.pos.y]) == 'undefined'){
                Memory[creep.room.roomName + " " + creep.pos.x + " " + creep.pos.y] = 0;
            }
            if(typeof(Memory['stepsAverage']) == 'undefined'){
                Memory['stepsAverage'] = 1;
            }
            Memory[creep.room.name + " " + creep.pos.x + " " + creep.pos.y] =Memory[creep.room.name + " " + creep.pos.x + " " + creep.pos.y] + 1;
            Memory['stepsAverage'] = Memory[creep.room.name + " " + creep.pos.x + " " + creep.pos.y]*.01 +Memory['stepsAverage']*.99;
            if(Memory[creep.room.name + " " + creep.pos.x + " " + creep.pos.y] > Memory['stepsAverage'] * 5){
                var result = creep.room.createConstructionSite(creep.pos.x,creep.pos.y, STRUCTURE_ROAD);
            }
            
            if(typeof(sources) != 'undefined' ){
                if(typeof(sources[creep.memory.roomName]) == 'undefined'){
                    this.chooseHarvestIndex(creep,slots);
                }
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
            creep.moveTo(sources[creep.memory.roomName][creep.memory.harvestIndex]);
            creep.harvest(sources[creep.memory.roomName][creep.memory.harvestIndex]);
        
        
        }
        else {
            creep.memory.harvestIndex = 0;
            var j = 0;
            var returnTo = this.chooseReturnIndex(creep, energyDropoffPoints, energyNeeded );
            
            if(typeof(returnTo) == 'undefined' && returnTo != null){
                creep.moveTo(Game.spawns.Spawn1);
                creep.transfer(Game.spawns.Spawn1,RESOURCE_ENERGY);
                creep.memory.harvesting = false;
                return slots;
            }
            
            console.log(creep.name + " returning to " + energyDropoffPoints[returnTo]);
            creep.moveTo(returnTo);
            creep.transfer(returnTo,RESOURCE_ENERGY);
            creep.memory.harvesting = false;
        }
        return slots;
	}
};

module.exports = roleHarvester;