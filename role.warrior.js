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
    run: function(creep,slots,droppedEnergy,sourcesAll,targets, structures) {
        var withdrawIndex = -1;
        if(creep.carry.energy == creep.carryCapacity){
            if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);   
            }
            return slots;
            
        }
        if(typeof(droppedEnergy) != 'undefined' && droppedEnergy.length > 0){
            if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
            return slots;
        }
        
        
		if (typeof(targets) != 'undefined' && targets.length > 0) {
		    //find the best enemy to attack
		    var enemyIndex = -1;
		    //pick a target
		    var siphon = false;
		    
		    for(var e in structures){
		        if(structures[e].owner.username != "keyboardkommander"){
		            if(structures[e].energyAvailable > 0){
		                enemyIndex = e;
		                siphon = true;
		            }
		            else if(siphon == false){
		                enemyIndex = e;
		            }
		        }
		    }
		    
		    if(siphon == true){
		        creep.moveTo(structures[enemyIndex]);
		        creep.withdraw(structures[enemyIndex],RESOURCE_ENERGY);
		    }
		    
			if(creep.moveTo(targets[enemyIndex]) == ERR_NO_PATH)
			{
			   creep.moveTo(creep.room.findClosestByPath(FIND_STRUCTURES));
			   creep.attack(creep.room.findClosestByPath(FIND_STRUCTURES));
			}
			else{
			    creep.attack(targets[enemyIndex]);
			}
		}
		else {
		    if(typeof(structures) != 'undefined' && structures.length > 0){
    			creep.moveTo(structures[enemyIndex]);
    			creep.attack(structures[enemyIndex]);
		        return slots
		    }
		    
		    return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,structures);
		}
		return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,structures);
	}
};