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
    logHarvestTime: function(time, x,y, creep){
        return;
        var idx = creep.room + "" + x+ " " + y;
        if(!Memory.harvestRooms){
            Memory.harvestRooms = {};
        }
        
        if(!Memory.harvestRooms[idx]["iterator"] > 0){
            Memory.harvestRooms[idx] = {};
            Memory.harvestRooms[idx]["iterator"] = 0;
            Memory.harvestRooms[idx]["size"] = 0;
            Memory.harvestRooms[idx]["full"] = false;
        }
        
        if(Memory.harvestRooms[idx]["iterator"] >= 1000){
            Memory.harvestRooms[idx]["iterator"] = 0;
            Memory.harvestRooms[idx]["full"] = true;
        }
        
        Memory.harvestRooms[idx][Memory.harvestRooms[idx]["iterator"]] = time;
        Memory.harvestRooms[idx]["iterator"] = Memory.harvestRooms[idx]["iterator"] + 1;
        
        if(Memory.harvestRooms[idx]["full"] == false){
            Memory.harvestRooms[idx]["size"] = Memory.harvestRooms[idx]["size"] + 1;
        }
        
    },
    getHarvestTime: function(x,y, creep){
        return Math.random() * 100; //TODO: fix this system
        
        var idx = creep.room + "" + x+ " " + y;
        var total = 0;
        if(Memory.harvestRooms && Memory.harvestRooms[idx] != null){
            for(var i = 0; i < Memory.harvestRooms[idx]["size"]; i++){
               total = total + Memory.harvestRooms[idx][i];
            }
            
            return total / Memory.harvestRooms[idx]["size"] + Math.random() * 100;
        }else{
            return 0;
        }
    },
    shouldSpawnMoreHarvesters: function(){
        
    }
}

module.exports = harvestTimes;