/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleFootman');
 * mod.thing == 'a thing'; // true
 */

var roleHarvester = require("roleHarvester");

module.exports = {
    run: function(creep, gameInfoManager){
        if(gameInfoManager.World[creep.room.name].targets.length > 0){ //TODO: unit prioritization
			creep.moveTo(targets[enemyIndex]);
			creep.attack(targets[enemyIndex]);
        }
    }
    else{
        roleHarvester.run(creep,gameInfoManager);        
    }
};