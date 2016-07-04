/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.information');
 * mod.thing == 'a thing'; // true
 */

var harvestRooms = new Map();

var harvestTimes = {
    logHarvestTime: function(time, spawn, room){
        harvestRooms[room.name + spawn] = time;
    },
    getHarvestTime: function(spawn, room){
        if(harvestRooms[room.name + spawn] == null){
            return 0;
        }
        return harvestRooms[spawn];
    },
    shouldSpawnMoreHarvesters: function(){
        
    }
}

module.exports = harvestTimes;