/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleHarvester');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    ChangeHarvestState: function(creep){
        var totalCarry = _.sum(creep.carry);
        
        //if we are at 0 carry, start harvesting
        if(totalCarry == 0){
            creep.memory.harvesting = true;
        }
        
        //if we are at full carry start returning
        else if (totalCarry == creep.carryCapacity)
        {
            creep.memory.harvesting = false;
        }
    },
    
    ChooseHarvestIndex: function(creep, gameInfoManager){
        //TODO: pick the closest harvest index with available slots
        creep.memory.harvestRoom = 0;
        creep.memory.harvestSource = 0;
        var closestRange = 999999;
        
        for(let roomName in gameInfoManager.World){
            for(var harvestingIndex in gameInfoManager.World[roomName].sources)
            {
                var thisRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].sources[harvestingIndex]);
                if(creep.memory.harvestSource == 0 && gameInfoManager.World[roomName].harvestSlots[harvestingIndex] > 0){
                    creep.memory.harvestSource = harvestingIndex;
                    creep.memory.harvestRoom = roomName;
                    closestRange = thisRange;
                    continue;
                }
                if(thisRange < closestRange && gameInfoManager.World[roomName].harvestSlots[harvestingIndex] > 0){
                    gameInfoManager.World[roomName].harvestSlots[harvestingIndex]--;
                    closestRange = thisRange;
                    creep.memory.harvestRoom = roomName;
                    creep.memory.harvestSource = harvestingIndex;
                }
            }
        }
        
        if(creep.memory.harvestRoom == 0){
            this.exploring = true;
        }
    },
    
    ChooseReturnIndex: function(creep, gameInfoManager){
        //choose the nearest return index
        this.closestReturnRoom = 0;
        this.closestReturnStructure = 0;
        var closestRange = 999999;
        
        for(let returningRoomName in gameInfoManager.World){
            for(var returningIndex in gameInfoManager.World[returningRoomName].returnStructures)
            {
                var thisRange = creep.pos.getRangeTo(gameInfoManager.World[returningRoomName].returnStructures[returningIndex]);
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
        //TODO: score exits based off of gold yield
        creep.memory.exploreIndex = Math.random() * creep.room.find(FIND_EXIT).length; //TODO: lump this in game info
    },
    
    PickupDroppedEnergy: function(creep, gameInfoManager){
        var closestEnergy = 0;
        for(let droppedEnergyHash in gameInfoManager.World[creep.room.name].droppedEnergy){
            if(closestEnergy == 0){
                closestEnergy = gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash];
                continue;
            }
            
            if(creep.pos.getRangeTo(gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash]) <
                creep.pos.getRangeTo(closestEnergy)){
                    closestEnergy = gameInfoManager.World[creep.room.name].droppedEnergy[droppedEnergyHash];
            }
        }
        
        creep.moveTo(closestEnergy);
        creep.pickup(closestEnergy);
    },
    
    ReturnEnergy: function(creep, gameInfoManager){
        this.ChooseReturnIndex(creep, gameInfoManager);
        
        if(this.exploring){
            return;
        }
        
        creep.moveTo(gameInfoManager.World[this.closestReturnRoom].returnStructures[this.closestReturnStructure]);
        for(var resourceType in creep.carry) {
            creep.transfer(gameInfoManager.World[this.closestReturnRoom].returnStructures[this.closestReturnStructure], resourceType);
        }
    },
    
    Harvest: function(creep, gameInfoManager){
        gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource];
        creep.moveTo(gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]);
        creep.harvest(gameInfoManager.World[creep.memory.harvestRoom].sources[creep.memory.harvestSource]);
    },
    
    Explore: function(creep, gameInfoManager){
        creep.moveTo(creep.room.find(FIND_EXIT)[creep.memory.exploreIndex]);
    },
    
    run: function(creep,gameInfoManager){
        this.exploring = false;
        
        this.ChangeHarvestState(creep);
        
        if(!creep.memory.harvesting){
            this.ReturnEnergy(creep, gameInfoManager);
        }
        if(creep.memory.harvesting){
            //harvest
            //if there is dropped energy pick it up
            if(gameInfoManager.World[creep.room.name].droppedEnergy.length > 0){
                this.PickupDroppedEnergy(creep,gameInfoManager);
                return;
            }
            
            if(typeof(creep.memory.harvestRoom) == 'undefined' || creep.memory.harvestRoom == 0){
                this.ChooseHarvestIndex(creep, gameInfoManager);
            }
            
            if(this.exploring)
            {
                
                if(typeof(creep.memory.exploreIndex) == 'undefined' || creep.memory.room != creep.room){
                    this.ChooseExploreIndex(creep, gameInfoManager);
                }
                creep.memory.room = creep.room;
                
                this.Explore(creep, gameInfoManager);
            }
            else{
                this.Harvest(creep, gameInfoManager);
            }
        }
    }
};