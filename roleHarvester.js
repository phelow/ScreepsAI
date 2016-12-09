/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleHarvester');
 * mod.thing == 'a thing'; // true
 */
var pathManager = require("PathManager")

module.exports = {
    ChangeHarvestState: function(creep){
        var totalCarry = _.sum(creep.carry);
        
        //if we are at full carry start returning
        if (totalCarry == creep.carryCapacity || (totalCarry >= creep.carryCapacity *.9 && creep.memory.role == "carrier"))
        {
            creep.memory.harvesting = false;
            creep.memory.harvestRoom = 0;
        }
        //if we are at 0 carry, start harvesting
        else if(totalCarry == 0){
            creep.memory.harvesting = true;
        }
        
    },
    
    GetDistanceTo: function(pos1,pos2){
        
        var aa = pos1.x-pos2.x;
        var bb = pos1.y-pos2.y;
        
        
        var a = Math.pow(aa,2);
        var b = Math.pow(bb,2);
        return Math.floor(Math.sqrt(a + b));  
    },
    
    ChooseHarvestIndex: function(creep, gameInfoManager){
        this.exploring = false;
        //pick the closest harvest index with available slots
        creep.memory.harvestRoom = 0;
        creep.memory.harvestSource = 0;
        var closestRange = 999999;
        
        for(let roomName in gameInfoManager.World){
            if(gameInfoManager.World[roomName].hostileCreeps.length > 1 || gameInfoManager.World[roomName].hostileStructures.length > 1
            || gameInfoManager.World[roomName].sourceKeepers.length > 0){
                continue;
            }
            
            for(var harvestingIndex in gameInfoManager.World[roomName].sources)
            {
                var thisRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].sources[harvestingIndex]);
                var thisDistance = this.GetDistanceTo(creep.pos,gameInfoManager.World[roomName].sources[harvestingIndex].pos);
                
                if(creep.memory.harvestRoom == 0 && gameInfoManager.World[roomName].harvestSlots[harvestingIndex] > 0
                && !(Infinity == thisRange || thisRange > thisDistance)){
                    gameInfoManager.World[roomName].harvestSlots[harvestingIndex]--;
                    creep.memory.harvestSource = harvestingIndex;
                    creep.memory.harvestRoom = roomName;
                    closestRange = thisRange;
                    continue;
                }
                
                
                if(thisRange < closestRange && gameInfoManager.World[roomName].harvestSlots[harvestingIndex] > 0 
                && !(Infinity == thisRange || thisRange > thisDistance)){
                    gameInfoManager.World[roomName].harvestSlots[harvestingIndex]--;
                    closestRange = thisRange;
                    creep.memory.harvestRoom = roomName;
                    creep.memory.harvestSource = harvestingIndex;
                }
            }
        }

        
        if(creep.memory.harvestRoom == 0){
            this.exploring = true;
            return;
        }
    },
    
    PickNearestReturnSpawn: function(creep, gameInfoManager){
        var distance = Infinity;
        for(var s in Game.spawns){
            var thisDistance = creep.pos.getRangeTo(creep);
            if(thisDistance < distance && Game.spawns[s].energyCapacity - Game.spawns[s].energy>= creep.carryCapacity){
                distance = thisDistance;
                creep.memory.closestSpawnReturn = s;
            }
        }
    },
    
    ReturnToNearestSpawn: function(creep, gameInfoManager){
        //if we don't have a return spawn get one
        if(typeof(creep.memory.closestSpawnReturn) == 'undefined'){
            this.PickNearestReturnSpawn(creep,gameInfoManager);
            
        }
        
        if(typeof(creep.memory.closestSpawnReturn) == 'undefined'){
            this.run(creep, gameInfoManager);
            return;
        }
        
        //return to the spawn
        pathManager.moveToNextStep(creep,pathManager.getNextStep(creep.pos,Game.spawns[creep.memory.closestReturnSpawn]));
        creep.transfer(Game.spawns[creep.memory.closestReturnSpawn],RESOURCE_ENERGY,_.sum(creep.carry));
        
    },  
    
    ChooseReturnIndex: function(creep, gameInfoManager){
        //choose the nearest return index
        this.closestReturnRoom = 0;
        this.closestReturnStructure = 0;
        var closestRange = 999999;
        
        for(let returningRoomName in gameInfoManager.World){
            for(var returningIndex in gameInfoManager.World[returningRoomName].returnStructures)
            {
                var thisRange = creep.pos.getRangeTo(gameInfoManager.World[returningRoomName].returnStructures[returningIndex].pos);
                
                if(this.closestReturnStructure == 0){
                    this.closestReturnStructure = returningIndex;
                    this.closestReturnRoom = returningRoomName;
                    closestRange = thisRange;
                    continue;
                }
                
                if(thisRange < closestRange){
                    this.closestRange = thisRange;
                    this.closestReturnRoom = returningRoomName;
                    this.closestReturnStructure = returningIndex;
                }
            }
        }
        
        if(this.closestReturnRoom == 0){
            this.exploring = true;
        }
    },
    
    ChooseExploreIndex: function(creep, gameInfoManager){
        creep.memory.exploreIndex = 0;
        if(typeof(Memory[creep.room.name]) == 'undefined'){
            Memory[creep.room.name] = {};
            Memory[creep.room.name].exitSuccessRates = {};
        }
        var cost = Infinity;
        //take ten random explore indices, choose the undefined one or one with the highest success rate
        for(var t = 0; t < 10; t++){
            var tryIndex = Math.floor(Math.random() * gameInfoManager.World[creep.room.name].exits.length);
            
            if(typeof(Memory[creep.room.name].exitSuccessRates[tryIndex]) == 'undefined'){
                Memory[creep.room.name].exitSuccessRates[tryIndex] = 0;
            }
            var thisDist = this.GetDistanceTo(creep.pos, gameInfoManager.World[creep.room.name].exits[tryIndex]) - 1;
            var thisCost = thisDist - Memory[creep.room.name].exitSuccessRates[tryIndex] * 10;
            if((typeof(creep.memory.exploreIndex) == 'undefined' 
            || thisCost < cost) && thisDist > 5 && creep.pos.x != gameInfoManager.World[creep.room.name].exits[tryIndex].x
            && gameInfoManager.World[creep.room.name].exits[tryIndex].y != creep.pos.y){
                cost = thisCost;
                creep.memory.exploreIndex = tryIndex;
            }
        }    
        creep.say("E" + creep.memory.exploreIndex);
        //Take away one point for choosing
        creep.memory.exploreRoom = creep.room.name;
        Memory[creep.room.name].exitSuccessRates[creep.memory.exploreIndex] = Memory[creep.room.name].exitSuccessRates[creep.memory.exploreIndex] - 1;
    },
    
    PickupDroppedEnergy: function(creep, gameInfoManager){
        var closestEnergy = 0;
        for(let droppedEnergyHash in gameInfoManager.World[creep.room.name].droppedEnergy){
            var range = creep.pos.getRangeTo(gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash]);
            if(closestEnergy == 0){
                closestEnergy = gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash];
                continue;
            }
            
            if(range <=
                creep.pos.getRangeTo(closestEnergy) && range <= 10){
                closestEnergy = gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash];
            }
        }
        pathManager.moveToNextStep(creep,pathManager.getNextStep(creep.pos,closestEnergy));
        creep.pickup(closestEnergy);
    },
    
    ReturnEnergy: function(creep, gameInfoManager){
        this.ChooseReturnIndex(creep, gameInfoManager);
        
        if(this.closestReturnRoom == 0){
            creep.say("RE");
            pathManager.moveToNextStep(creep,pathManager.getNextStep(creep.pos,Game.spawns.Spawn1));
            return;
        }
        
        creep.say(gameInfoManager.World[this.closestReturnRoom].returnStructures[this.closestReturnStructure]);
        pathManager.moveToNextStep(creep,pathManager.getNextStep(creep.pos,gameInfoManager.World[this.closestReturnRoom].returnStructures[this.closestReturnStructure]));
        
        
        for(var resourceType in creep.carry) {
            creep.transfer(gameInfoManager.World[this.closestReturnRoom].returnStructures[this.closestReturnStructure], resourceType); //TODO: if successful return 2 successpoints
        }
    },
    
    Harvest: function(creep, gameInfoManager){
        if(typeof(gameInfoManager.World[creep.memory.harvestRoom]) == 'undefined'){
            this.ChooseHarvestIndex(creep,gameInfoManager);
        }
        
        if(creep.memory.harvestRoom == 0 
        || typeof(gameInfoManager.World[creep.memory.harvestRoom]) == 'undefined' 
        || typeof(gameInfoManager.World[creep.memory.harvestRoom].sources) == 'undefined'
        || typeof(gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]) == 'undefined'){
            return false; //TODO: fix this
        }
        if('undefined' == typeof(gameInfoManager.World[creep.memory.harvestRoom]) 
        || gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource].energyAvailable == 0){
            this.ChooseHarvestIndex(creep,gameInfoManager);
              
        }
        
        
        if(pathManager.moveToNextStep(creep,gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]) == -2){
            this.ChooseHarvestIndex(creep,gameInfoManager);
            if(typeof(gameInfoManager.World[creep.memory.harvestRoom]) == 'undefined'){
                return;
            }
        }
        
        if(typeof(creep.memory.exploreIndex) == 'undefined' || creep.memory.room != creep.room.name){
            if(typeof(creep.memory.exploreIndex) != 'undefined' && typeof(creep.memory.exploreRoom) != 'undefined'){
                Memory[creep.memory.exploreRoom ].exitSuccessRates[creep.memory.exploreIndex] =
                    Memory[creep.memory.exploreRoom ].exitSuccessRates[creep.memory.exploreIndex] + 6;
            }
        }
        
        creep.memory.room = creep.room.name;
        
        
        creep.harvest(gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]);
        
    },
    
    Explore: function(creep, gameInfoManager){
        creep.say("E");
        //Track success rate
        if(typeof(creep.memory.exploreIndex) == 'undefined' || creep.memory.room != creep.room.name){
            if(typeof(creep.memory.exploreIndex) != 'undefined' && typeof(creep.memory.exploreRoom) != 'undefined'){
                
                Memory[creep.memory.exploreRoom ].exitSuccessRates[creep.memory.exploreIndex] = Memory[creep.memory.exploreRoom ].exitSuccessRates[creep.memory.exploreIndex] + 2;
            }
            this.ChooseExploreIndex(creep, gameInfoManager);
        }
        
        creep.memory.room = creep.room.name;
        
        if(typeof(gameInfoManager.World[creep.room.name].exits[creep.memory.exploreIndex]) == 'undefined' ||
        (creep.pos.x == gameInfoManager.World[creep.room.name].exits[creep.memory.exploreIndex].x &&
        creep.pos.y == gameInfoManager.World[creep.room.name].exits[creep.memory.exploreIndex].y)){
            this.ChooseExploreIndex(creep, gameInfoManager);
        }
        
        var errCode = pathManager.moveToNextStep(creep,gameInfoManager.World[creep.room.name].exits[creep.memory.exploreIndex]);
        if(errCode == -2 || errCode == -7){
            this.ChooseExploreIndex(creep, gameInfoManager);
        }
    },
    
    run: function(creep,gameInfoManager){
        if(typeof(creep.memory.roads) == 'undefined'){
            creep.memory.roads = {};
        }
        
        if(typeof(creep.memory.roads[creep.room.name + creep.pos.x + " " + creep.pos.y]) == 'undefined'){
            creep.memory.roads[creep.room.name + creep.pos.x + " " + creep.pos.y] = 1;
        }
        else{
            creep.memory.roads[creep.room.name + creep.pos.x + " " + creep.pos.y] = creep.memory.roads[creep.room.name + creep.pos.x + " " + creep.pos.y] + 1
        }
        
        if(creep.memory.roads[creep.room.name + creep.pos.x + " " + creep.pos.y] > 5){
            creep.room.createConstructionSite(creep.pos.x,creep.pos.y,STRUCTURE_ROAD);
        }
        
        
        this.exploring = false;
        
        this.ChangeHarvestState(creep);
        
        if(!creep.memory.harvesting){
            this.ReturnEnergy(creep, gameInfoManager);
        }
        else{
            //harvest
            //if there is dropped energy pick it up
            if(gameInfoManager.World[creep.room.name].droppedEnergy.length > 0){
                this.PickupDroppedEnergy(creep,gameInfoManager);
                return;
            }
            //TODO: cleanup, too many lines
            if(typeof(creep.memory.harvestRoom) == 'undefined' 
            || creep.memory.harvestRoom == 0 
            || typeof(gameInfoManager.World[creep.memory.harvestRoom]) == "undefined" 
            || typeof(gameInfoManager.World[creep.memory.harvestRoom].sources) == "undefined" 
            || typeof(gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]) == "undefined" ){
                this.ChooseHarvestIndex(creep, gameInfoManager);
            }
            creep.say(this.exploring);
            if(this.exploring || false == this.Harvest(creep, gameInfoManager))
            {
                this.Explore(creep, gameInfoManager);
            }
        }
    }
};