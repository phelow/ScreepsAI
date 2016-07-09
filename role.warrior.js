/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.warrior');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require('role.harvester');
module.exports = {
    run: function(creep,slots,droppedEnergy,sourcesAll) {
        if(creep.carry.energy == creep.carryCapacity){
            if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);   
            }
            return slots;
            
        }
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
        if(droppedEnergy.length > 0){
            if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
            return slots;
        }
        
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
        }
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_HOSTILE_SPAWNS);
        }
        
		if (targets.length > 0) {
		    console.log(41);
		    //find the best enemy to attack
		    var enemyIndex = 0;
			creep.moveTo(targets[enemyIndex]);
			creep.attack(targets[enemyIndex]);
		}
		else {
		    return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll);
		}
		return slots;
	}
};