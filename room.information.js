/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.information');
 * mod.thing == 'a thing'; // true
 */

//TODO: improve by averaging times rather than just taking the last one.
var harvestTimes = {
    logHarvestTime: function(time, spawn, room){
        if(!Memory.harvestRooms){
            Memory.harvestRooms = {};
        }
        
        var idx = room + spawn;
        
        Memory.harvestRooms[idx] = time;
        console.log("set time: " + Memory.harvestRooms[idx]);
    },
    getHarvestTime: function(spawn, room){
        var idx = room + spawn;
        if(Memory.harvestRooms && Memory.harvestRooms[idx] != null){
            return Memory.harvestRooms[idx];
        }else{
            return 0;
        }
    },
    shouldSpawnMoreHarvesters: function(){
        
    }
}

module.exports = harvestTimes;