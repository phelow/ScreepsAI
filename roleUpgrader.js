/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleUpgrader');
 * mod.thing == 'a thing'; // true
 */
 
var pathManager = require("PathManager");
var roleHarvester = require("roleHarvester");

module.exports = {
    run: function(creep, gameInfoManager){
        roleHarvester.ChangeHarvestState(creep);
        
        if(creep.memory.harvesting 
        || typeof(creep.room.controller) == 'undefined' 
        || !creep.room.controller.my ){
            roleHarvester.run(creep,gameInfoManager);
            return;
        }
        
        if(creep.upgradeController(creep.room.controller) != 0){
            pathManager.moveToNextStep(creep,creep.room.controller);
            return;
        }
    }
};