/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleBuilder');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require("roleHarvester");
var roleUpgrader = require("roleUpgrader");


module.exports = {
    PickSite: function(creep, gameInfoManager){
        //pick the nearest controller
        var closestRange = 99999;
        creep.memory.buildRoom  = 0;
        for(var roomName in gameInfoManager.World){
            if(gameInfoManager.World[roomName].hostileCreeps)
            
            for(var constructionSite in gameInfoManager.World[roomName].constructionSites){
                var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].constructionSites[constructionSite].pos);
                
                if(curRange < closestRange){
                    closestRange = curRange;
                    creep.memory.buildRoom = roomName;
                    creep.memory.buildSite = constructionSite;
                }
            }
        }
    },
    
    RepairInRange: function(creep,gameInfoManager){
        for(var structure in gameInfoManager.World[creep.room.name].damagedStructures){
            if(creep.pos.inRangeTo(gameInfoManager.World[creep.room.name].damagedStructures[structure], 3)){
                creep.repair(gameInfoManager.World[creep.room.name].damagedStructures[structure]);
            }
        }
    },
    
    run: function(creep, gameInfoManager){ //SIPHON from upgrades and other units
        roleHarvester.ChangeHarvestState(creep);
        
        //if there is a repairable structure within range repair it
        this.RepairInRange(creep,gameInfoManager);
        
        if(creep.memory.harvesting == false
        || creep.memory.buildRoom == 0
        || typeof(creep.memory.buildRoom) == 'undefined' 
        || typeof(gameInfoManager.World[creep.memory.buildRoom]) == 'undefined' 
        || typeof(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]) == 'undefined'){
            this.PickSite(creep,gameInfoManager);
        }
        
        if(creep.memory.harvesting
        || creep.memory.buildRoom == 0
        || typeof(creep.memory.buildRoom) == 'undefined' 
        || typeof(gameInfoManager.World[creep.memory.buildRoom]) == 'undefined' 
        || typeof(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]) == 'undefined'){
            roleHarvester.run(creep,gameInfoManager);
            return;
        }
        creep.say("build: " + t);
        var t = creep.build(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]) 
        
        if(t == -14){
            creep.memory.role = 'upgrader';
            roleUpgrader.run(creep,gameInfoManager);
        }
        
        if(t != 0){
            if(creep.moveTo(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite])!= 0){
                roleHarvester.run(creep,gameInfoManager);
            }
        }
        
    }

};