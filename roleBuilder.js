/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleBuilder');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require("roleHarvester");

module.exports = {
    PickSite: function(creep, gameInfoManager){
        //pick the nearest controller
        var closestRange = 99999;
        for(var roomName in gameInfoManager.World){
            for(var constructionSite in gameInfoManager.World[roomName].constructionSites){
                if(typeof(creep.memory.controller) == 'undefined'){
                    creep.memory.buildRoom = roomName;
                    creep.memory.buildSite = constructionSite;
                }
                
                var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].constructionSites[constructionSite].pos);
                
                if(curRange < closestRange){
                    closestRange = curRange;
                    creep.memory.buildRoom = roomName;
                    creep.memory.buildSite = constructionSite;
                }
            
            }
        }
        creep.say("Building " + creep.memory.buildSite);
    },
    
    run: function(creep, gameInfoManager){
        roleHarvester.ChangeHarvestState(creep);
        
        if(typeof(creep.memory.buildRoom) == 'undefined' || creep.memory.buildRoom == 'undefined'){
            this.PickSite(creep,gameInfoManager);
        }
        
        if(creep.memory.harvesting || typeof(creep.memory.buildRoom) == 'undefined' || typeof(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]) == 'undefined'){
            roleHarvester.run(creep,gameInfoManager);
            return;
        }
        
        if(creep.build(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]) != 0){
            creep.moveTo(gameInfoManager.World[creep.memory.buildRoom].constructionSites[creep.memory.buildSite]);
        }
        
    }

};