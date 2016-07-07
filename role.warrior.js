/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.warrior');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        
        if(creep.carry.energy == creep.carryCapacity){
            if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);   
            }
            return;
            
        }
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
        if(droppedEnergy.length > 0){
            
            if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
            return;
        }
        
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_HOSTILE_STRUCTURES);
        }
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_HOSTILE_SPAWNS);
        }
        
        if(targets.length == 0){
            var rom = Game.rooms[Math.random * Game.rooms.length];
            var exit = creep.pos.findClosestByRange(rom);
            creep.moveTo(exit);
            console.log("no creeps found");
        }
		if (targets.length > 0) {
		    //find the best enemy to attack
		    var enemyIndex = 0;
            for(var i = 0; i < sources.length; i++){
                if(this.sourceSelectionPoints(sources[i],creep) < this.sourceSelectionPoints(sources[enemyIndex],creep)){
                    enemyIndex = i;
                }   
            
            }
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
            console.log("engaging enemy");
			creep.moveTo(targets[enemyIndex]);
			creep.attack(targets[enemyIndex]);
		}
		else {
            roleHarvester.run(creep,true);
		}
	}
};