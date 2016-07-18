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
    run: function(creep,slots,droppedEnergy,sourcesAll,targets, structures,energyDropoffPoints,energyNeeded) {
        var withdrawIndex = -1;
        if(creep.carry.energy == creep.carryCapacity){//run: function(creep, slots,droppedEnergy,sources, roads, enemyStructures,energyDropoffPoints,energyNeeded) 
		    return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll, null, structures,energyDropoffPoints,energyNeeded); //TODO fix null
            
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
		    for(var e in targets){
		        if(targets[e].owner.username != "keyboardkommander" || targets[e].owner.username != 'thiesp'){
		            enemyIndex = e;
		        }
		        
		    }
		    
		    if(enemyIndex != -1){
		        
		        creep.moveTo(structures[enemyIndex]);
		        creep.attack(structures[enemyIndex]);
		        return slots;
		    }
		    
		    //pick a target
		    var siphon = false;
		    
		    for(var e in structures){
		        if(structures[e].owner.username != "keyboardkommander" || structures[e].owner.username != 'thiesp'){
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
		    else{
		        creep.moveTo(structures[enemyIndex]);
		        creep.attack(structures[enemyIndex]);
		    }
		}
		else {
		    if(typeof(structures) != 'undefined' && structures.length > 0){
    			creep.moveTo(structures[enemyIndex]);
    			creep.attack(structures[enemyIndex]);
		        return slots
		    }
		    
		    return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,structures,energyDropoffPoints,energyNeeded);
		}
		return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,structures,energyDropoffPoints,energyNeeded);
	}
};