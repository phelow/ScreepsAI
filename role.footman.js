var information = require('room.information');
var roleHarvester = require('role.harvester');

var roleFootman = {
    enemySelectionPoints: function(source,creep) {
        var steps = Math.sqrt(Math.pow(source.pos.x - creep.pos.x,2) + Math.pow(source.pos.y - creep.pos.y,2));
        
        return steps;
    },
    run: function(creep,slots) {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        /*if(targets.length == 0){
            console.log("no creeps found");
        }*/
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
            return roleHarvester.run(creep,slots);
		}
		return slots;
	}
};

module.exports = roleHarvester;