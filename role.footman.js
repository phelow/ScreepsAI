var information = require('room.information');
var roleHarvester = require('role.harvester');

var roleFootman = {
    enemySelectionPoints: function(source,creep) {
        var steps = Math.sqrt(Math.pow(source.pos.x - creep.pos.x,2) + Math.pow(source.pos.y - creep.pos.y,2));
        
        return steps;
    },
    run: function(creep,slots,droppedEnergy,sourcesAll,targets) {
        /*if(targets.length == 0){
            console.log("no creeps found");
        }*/
		if (targets.length > 0) {
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

module.exports = roleHarvester;