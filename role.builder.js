var roleHarvester = require('role.harvester');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep, slots,droppedEnergy,sourcesAll,sourcesChecking,structures,pop,enemyStrctures,constructionSites,energyDropoffPoints,energyNeeded) {
        if(pop < 5){
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,true,enemyStrctures,energyDropoffPoints,energyNeeded);
        }
        
		 var damaged = [ ];

		for(var index in structures)
		{
			var structure = structures[index];
			if(structure.hits < (structure.hitsMax - 50))
				damaged.push(structure);
		}
		
	    if(sourcesChecking.length == 0){
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,true,enemyStrctures,energyDropoffPoints,energyNeeded);
	        return slots;
	    }
	    if(creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	       var isWall = false;
	       if(!constructionSites.length || constructionSites.length == 0){
                targets = creep.room.find(STRUCTURE_WALL);
                isWall = true;
            }
            
            if(!constructionSites.length || constructionSites.length == 0){
                targets = damaged;
            }
            var selection = 0;
            
                
            for(var q in constructionSites){
                if(constructionSites[q].structureType == STRUCTURE_EXTENSION)
                {
                    selection = q;
                }
            }
            console.log(selection);
            console.log(constructionSites);
            if(constructionSites.length > 0) {
                console.log("building");
                if(creep.build(constructionSites[selection]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(constructionSites[selection]);
                    return slots;
                }
            }
            else{
                console.log("not building");
            }
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,true,enemyStrctures,energyDropoffPoints,energyNeeded);
	    }
	    else{
            return roleHarvester.run(creep,slots,droppedEnergy,sourcesAll,true,enemyStrctures,energyDropoffPoints,energyNeeded);
	        
	    }
	    return slots;
	}
};

module.exports = roleBuilder;