/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('ConstructionManager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    BuildSites: function(gameInfoManager){
        for(var room in gameInfoManager.World){
            for(var source in gameInfoManager.World[room].sources){
                var spawnPos = gameInfoManager.World[room].sources[source].pos;
        		var xOffset = Math.round(Math.random() * 8-4);
        		var yOffset = Math.round(Math.random() * 8 -4);
                var dist = spawnPos.getRangeTo(spawnPos.x + xOffset, spawnPos.y + yOffset);
                if(dist >=2 && dist <= 3){
                    gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset , STRUCTURE_TOWER);
                    gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset ,spawnPos.y + yOffset, STRUCTURE_SPAWN);
            		
                    console.log("building extension:" + gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_EXTENSION));
                }
                else{
                    console.log(dist);
                }
                
            }
        }
    }
};