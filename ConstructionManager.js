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
        		var xOffset = Math.round(Math.random() * 10 -5);
        		var yOffset = Math.round(Math.random() * 10 -5);
                
                gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_TOWER);
                gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_SPAWN);
        		
                gameInfoManager.World[room].room.createConstructionSite(spawnPos.x + xOffset, spawnPos.y + yOffset, STRUCTURE_EXTENSION);
                
            }
        }
    }
};