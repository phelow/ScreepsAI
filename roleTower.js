/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleTower');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    run: function(tower, gameInfoManager){
        //TODO: if creeps attack
        if(gameInfoManager.World[tower.room.name].hostileCreeps.length > 0){
            tower.attack(gameInfoManager.World[tower.room.name].hostileCreeps[0]);
        }
        
        //TODO: if friendly creeps heal
        
        //TODO: finally repair if no other options
        if(gameInfoManager.World[tower.room.name].damagedStructures.length > 0){
            tower.repair(gameInfoManager.World[tower.room.name].damagedStructures[0]);
        }
    }
};