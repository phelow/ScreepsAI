var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sourcesAll,sourcesChecking,structures,pop,enemyStrctures,constructionSites) {
        if(pop < 5){
            return roleHarvester.run(creep, slots,droppedEnergy,sourcesAll,enemyStrctures);
        }
        
		 var damaged = [ ];

		for(var index in structures)
		{
			var structure = structures[index];
			if(structure.hits < (structure.hitsMax - 50))
				damaged.push(structure);
		}
	        
	    if(sourcesChecking.length == 0){
	        slots = roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,enemyStrctures);
	        return slots;
	    }
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	       if(!constructionSites.length || constructionSites.length == 0){
                targets = creep.room.find(STRUCTURE_WALL);
            }
            
            if(!constructionSites.length || constructionSites.length == 0){
                targets = damaged;
            }
            
            if(constructionSites.length > 0) {
                var selection = 0;
                for(var q in constructionSites){
                    if(constructionSites[q].structureType == STRUCTURE_EXTENSION)
                    {
                        selection = q;
                    }
                }
                if(creep.build(constructionSites[selection]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(constructionSites[selection]);
                    return slots;
                }
            }
	    }
	    else{
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,enemyStrctures);
	        
	    }
	    return slots;
	}
};

module.exports = roleBuilder;