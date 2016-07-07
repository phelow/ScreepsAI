var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sourcesChecking = creep.room.find(FIND_CONSTRUCTION_SITES);
	     
	     var structures = creep.room.find(FIND_STRUCTURES);
		 var damaged = [ ];

		for(var index in structures)
		{
			var structure = structures[index];
			if(structure.hits < (structure.hitsMax - 50))
				damaged.push(structure);
		}
	        
	    if(sourcesChecking.length == 0){
	        roleHarvester.run(creep);
	        return;
	    }
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        
            if(!targets.length || targets.length == 0){
                targets = creep.room.find(STRUCTURE_WALL);
            }
            
            if(!targets.length || targets.length == 0){
                targets = damaged;
                console.log("targets:"  + targets.length);
            }
            
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        if(Game.spawns.Spawn1.energy == Game.spawns.Spawn1.energyCapacity){
	            if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE)
	            {
	                creep.moveTo(creep.room.spawns[0]);
	            }
	            return;
	        }
	        
	        roleHarvester.run(creep);
	    }
	}
};

module.exports = roleBuilder;