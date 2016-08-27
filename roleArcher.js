/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleArcher');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require("roleHarvester");
var roleFootman = require("roleFootman");

module.exports = {
    FindNearestSpawn: function(creep){
        var nearestSpawn;
        var nearestDist = Infinity;
        for(var s in Game.spawns){
            var spawn = Game.spawns[s];
            
            dist = creep.pos.getRangeTo(spawn);
            
            if(dist < nearestDist){
                nearestDist = dist;
                nearestSpawn = spawn;
            }
        }
        
        return nearestSpawn;
    },
    
    ReturnToNearestSpawn: function(creep){
        creep.moveTo(this.FindNearestSpawn(creep));  
    },
    
    kite: function(creep, target,gameInfoManager) {
		if (target.pos.inRangeTo(creep.pos, 2)) {
			//find an available position
			if(creep.moveTo(creep.pos.x + creep.pos.x - target.pos.x, creep.pos.y + creep.pos.y - target.pos.y ) != 0){
	            this.ReturnToNearestSpawn(creep, gameInfoManager);
			}
			return true;
		} else if (target.pos.inRangeTo(creep.pos, 3)) {
			return true;
		}
		else {
			creep.moveTo(target);
			return true;
		}

		return false;
	},
	
	run: function(creep,gameInfoManager){
	    roleFootman.findNearestTargetCreep(creep,gameInfoManager);
	    
	    if(roleFootman.killRoom == 0){
	        roleHarvester.Explore(creep, gameInfoManager);
	        return;
	    }
	    
	    delete creep.memory.exploreIndex;
	    
	    creep.rangedAttack(gameInfoManager.World[roleFootman.killRoom].hostileCreeps[roleFootman.killSite]);
	    this.kite(creep, gameInfoManager.World[roleFootman.killRoom].hostileCreeps[roleFootman.killSite],gameInfoManager);
	}
};