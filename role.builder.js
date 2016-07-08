var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, slots) {
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
	        slots = roleHarvester.run(creep,slots);
	        return slots;
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
            }
            
            if(targets.length) {
                var selection = 0;
                for(var q in targets){
                    if(targets[q].structureType == STRUCTURE_EXTRACTOR)
                    {
                        selection = q;
                    }
                }
                if(creep.build(targets[q]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(targets[q]);
                    return slots;
                }
            }
	    }
	    else{
	        if(creep.room.energyAvailable < creep.room.energyCapacityAvailable * .1){
	            slots = roleHarvester.run(creep,slots);
	        }
	        else{
	            creep.moveTo(Game.spawns.Spawn1);
	        }
	    }
	    return slots;
	}
};

module.exports = roleBuilder;