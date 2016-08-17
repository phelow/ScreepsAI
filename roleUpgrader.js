/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleUpgrader');
 * mod.thing == 'a thing'; // true
 */
 
var roleHarvester = require("roleHarvester");

module.exports = {
    PickController: function(creep, gameInfoManager){
        //pick the nearest controller
        var closestRange = 99999;
        for(var roomName in gameInfoManager.World){
            
            
            if(typeof(creep.memory.controller) == 'undefined'){
                creep.memory.controllerRoom = roomName;
            }
            console.log(gameInfoManager.World[roomName].upgradeableController);
            var curRange = creep.pos.getRangeTo(gameInfoManager.World[roomName].upgradeableController.pos);
            
            if(curRange < closestRange){
                closestRange = curRange;
                creep.memory.controllerRoom = roomName;
            }
        }
    },
    
    run: function(creep, gameInfoManager){
        roleHarvester.ChangeHarvestState(creep);
        
        if(creep.memory.harvesting){
            roleHarvester.run(creep,gameInfoManager);
            return;
        }
        if(typeof(creep.memory.controllerRoom) == 'undefined'){
            this.PickController(creep,gameInfoManager);
        }
        
        if(creep.upgradeController(gameInfoManager.World[creep.memory.controllerRoom].upgradeableController) != 0){
            creep.moveTo(gameInfoManager.World[creep.memory.controllerRoom].upgradeableController);
        }
        
    }
};